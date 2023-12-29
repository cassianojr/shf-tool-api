import express from 'express';

const delphiRound = express.Router();
delphiRound.post('/notify-start', (req, res) => {
  res.send('Hello, Delphi Round start!');
});

delphiRound.post('/schedule-end', (req, res) => {
    res.send('Hello, Delphi Round end!');
});

export default delphiRound; 
