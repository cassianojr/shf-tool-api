import express, {Express} from 'express';
import dotenv from 'dotenv';
import delphiRound from './routes/delphi-round.routes';

dotenv.config();

const app: Express = express();
app.disable('x-powered-by');
app.use(express.json());

app.use('/delphi-round', delphiRound);

export default app;