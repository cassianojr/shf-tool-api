import express from 'express';
import * as schedule from 'node-schedule';

import { EmailService, EmailTemplate } from '../services/email.service';

const delphiRound = express.Router();
delphiRound.post('/notify-start', async (req, res) => {
  const {to, message} = req.body;

  if(!to || !message) {
    res.status(422).send('Not Acceptable');
  }

  const sgRes = await EmailService.sendEmail({
    email: to,
    message,
  });

  if(sgRes.statusCode !== 202) {
    res.status(500).send('Internal Server Error');
  }

  res.status(200).json({to, message});
});


delphiRound.post('/schedule-end', (req, res) => {
  const { endAt, message, to } = req.body;
  
  if(!to || !message || !endAt) {
    res.status(422).send('Not Acceptable');
  }

  const dateEnd = new Date(endAt);

  const msgScheduled = {
    email: to,
    message,
  }

  console.log("Delphi Round end at: ", dateEnd.toDateString(), dateEnd.toTimeString());

  const job = schedule.scheduleJob(dateEnd, function (msg: EmailTemplate) {
    console.log(`[server] sent email to ${msg.email} with content: ${msg.message} at ${new Date().toTimeString()}`);
    EmailService.sendEmail(msg);
  }.bind(null, msgScheduled));


  res.status(200).json('ok');
});


export default delphiRound; 
