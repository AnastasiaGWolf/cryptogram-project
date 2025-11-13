import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { router as userRoutes } from './routes/userRoutes';
import session from 'express-session';

dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan('dev'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false
}));

app.use('/api/users', userRoutes);

export default app;
