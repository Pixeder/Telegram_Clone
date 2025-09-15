import express from 'express';
import cors from 'cors';
import cookieparser from 'cookie-parser';

const app = express();

app.use(
  cors({
    origin: `${process.env.ORIGIN}`,
    credentials: true,
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));
app.use(cookieparser());

import userRouter from './routes/user.routes.js';

app.use('/api/v1/users', userRouter);

import messageRouter from './routes/message.route.js';

app.use('/api/v1/messages', messageRouter);

import groupRouter from './routes/group.route.js';

app.use('/api/v1/groups', groupRouter);

import fileRouter from './routes/file.route.js';

app.use('/api/v1/files', fileRouter);

export { app };
