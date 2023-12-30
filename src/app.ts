import express, {Express} from 'express';
import dotenv from 'dotenv';
import delphiRound from './routes/delphi-round.routes';

dotenv.config();
if(process.env.NODE_ENV === 'development') dotenv.config({ path: `.env.local`, override: true });

const app: Express = express();
app.disable('x-powered-by');
app.use(express.json());

app.use('/delphi-round', delphiRound);

export default app;