import express from 'express';
import * as schedule from 'node-schedule';


type MsgScheduled = {
  to: string;
  message: string;
}

const delphiRound = express.Router();
delphiRound.post('/notify-start', (req, res) => {
  res.send('Hello, Delphi Round start!');
});

delphiRound.post('/schedule-end', (req, res) => {

  const { endAt, message, to } = req.body;
  const dateEnd = new Date(endAt);

  const msgScheduled = {
    to,
    message,
  }

  console.log("Delphi Round end at: ", dateEnd.toDateString(), dateEnd.toTimeString());

  const job = schedule.scheduleJob(dateEnd, function (msg: MsgScheduled) {
    console.log(`[${new Date().toTimeString()}] sent email to ${msg.to} with content: ${msg.message} `);
  }.bind(null, msgScheduled));


  res.status(200).send('ok');
});


export default delphiRound; 
