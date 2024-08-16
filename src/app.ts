import express, {Express} from 'express';
import dotenv from 'dotenv';
import api from './routes/delphi-round.routes';
import cors from 'cors';
import db from './database/SQLiteConnection';

dotenv.config();
if(process.env.NODE_ENV === 'development') dotenv.config({ path: `.env.local`, override: true });


db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    endAt TEXT NOT NULL
  )`);
});

const app: Express = express();
app.disable('x-powered-by');
app.use(express.json());
app.use(cors());

app.use('/api', api);

export default app;