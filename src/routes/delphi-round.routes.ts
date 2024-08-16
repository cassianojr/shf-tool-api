import express from 'express';
import * as schedule from 'node-schedule';

import { EmailService, EmailTemplate } from '../services/email.service';
import ScheduleModel from '../models/ScheduleModel';

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


api.post('/schedule-end', (req, res) => {
  const { endAt, message, to } = req.body;

  if (!to || !message || !endAt) {
    res.status(422).send('Not Acceptable');
  }

  const dateEnd = new Date(endAt);

  const schedule = {
    email: to,
    message,
    endAt: dateEnd.getTime().toString(),
  }

  ScheduleModel.create(schedule).then((id) => {
    if (id) {
      console.log(`[server] scheduled email to ${to} with content: ${message} at ${dateEnd.toTimeString()}`);
      schedule.endAt = dateEnd.toISOString();
    }
  });

  const msg = {
    email: to,
    message,
  }

  console.log(`[server] sent email to ${msg.email} with content: ${msg.message} at ${new Date().toTimeString()}`);
  EmailService.sendEmail(msg);

  res.status(200).json('ok');
});

api.get('/check-schedules', async (req, res) => {
  const schedules = await ScheduleModel.getAll();

  schedules.forEach((schedule) => {
    const dateEnd = new Date(parseInt(schedule.endAt));
    const now = new Date();

    if (dateEnd < now) {
      console.log(`[server] sent email to ${schedule.email} with content: ${schedule.message} at ${now.toTimeString()}`);
      EmailService.sendEmail({
        email: schedule.email,
        message: schedule.message,
      });

      ScheduleModel.remove(schedule.id as number);
    }
  });

  res.status(200).json(schedules);
});


export default api; 
