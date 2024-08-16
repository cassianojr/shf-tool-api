import express, {Express} from 'express';
import dotenv from 'dotenv';
import api from './routes/api.route';
import cors from 'cors';
import db, { SQLiteSetup } from './database/SQLiteConnection';

dotenv.config();
if(process.env.NODE_ENV === 'development') dotenv.config({ path: `.env.local`, override: true });

SQLiteSetup();

const app: Express = express();
app.disable('x-powered-by');
app.use(express.json());
app.use(cors());

app.use('/api', api);

export default app;