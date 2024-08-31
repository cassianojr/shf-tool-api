import express from 'express';
import * as schedule from 'node-schedule';

import { EmailService, EmailTemplate } from '../services/email.service';
import ScheduleModel from '../models/ScheduleModel';
import EcosProjectModel from '../models/EcosProjectModel';

const api = express.Router();
api.post('/notify-start', async (req, res) => {
  const { to, message } = req.body;

  if (!to || !message) {
    res.status(422).send('Not Acceptable');
  }

  const sgRes = await EmailService.sendEmail({
    email: to,
    message,
  });

  if (sgRes.statusCode !== 202) {
    res.status(500).send('Internal Server Error');
  }

  res.status(200).json({ to, message });
});

/**
 * @Route POST /api/schedule-end
 * @Description Schedule an email to be sent at a specific time
 * @Params {string} endAt - The time to send the email
 * @Params {string} message - The message to send
 * @Params {string} to - The email to send to
 * @Params {string} ecosProjectId - The ecos project id
 * @Response {string} - 'ok'
 */
api.post('/schedule-end', (req, res) => {
  const { endAt, message, to, ecosProjectId } = req.body;

  if (!to || !message || !endAt) {
    res.status(422).send('Not Acceptable');
  }

  const dateEnd = new Date(endAt);

  const schedule = {
    email: to,
    message,
    endAt: dateEnd.getTime().toString(),
    ecosProjectId
  }

  ScheduleModel.create(schedule).then((id) => {
    if (id) {
      console.log(`[server] scheduled email to ${to} with content: ${message} at ${dateEnd.toTimeString()}`);
      schedule.endAt = dateEnd.toISOString();
    }
  }).catch(err => console.log(err));

  res.status(200).json('ok');
});

/**
 * @Route DELETE /api/cancel-schedule/:ecosId
 * @Description Cancel a scheduled email
 * @Params {string} ecosId - The ecos project id
 */
api.delete('/cancel-schedule/:ecosId', (req, res) => {
  const { ecosId } = req.params;

  if (!ecosId) {
    res.status(422).send('Not Acceptable');
  }

  const schedules = ScheduleModel.getAll().then((schedules) => {
    schedules.forEach(async (schedule) => {
      if (schedule.ecosProjectId === ecosId) {
        console.log(`[server] removed schedule with id: ${schedule.id}`);
        await ScheduleModel.remove(schedule.id as number);

        res.status(200).json('ok');

      }
    });
  }).catch(err => {
    console.log(err);
    res.status(500).send('Internal Server Error');
  });

});

/**
 * @Route GET /api/check-schedules
 * @Description Check all schedules and send emails if the time has passed, also remove the schedule and update the ecos project status to finished
 */
api.get('/check-schedules', async (req, res) => {
  const schedules = await ScheduleModel.getAll();

  schedules.forEach(async (schedule) => {
    const dateEnd = new Date(parseInt(schedule.endAt));
    const now = new Date();

    try {

      await EcosProjectModel.updateEcosProjectStatus(schedule.ecosProjectId);

      if (dateEnd < now) {
        console.log(`[server] sent email to ${schedule.email} with content: ${schedule.message} at ${now.toTimeString()}`);
        EmailService.sendEmail({
          email: schedule.email,
          message: schedule.message,
        });

        ScheduleModel.remove(schedule.id as number);
      }

    } catch (e) {
      console.error(e);
    }
  });

  res.status(200).json(schedules);
});


export default api; 
