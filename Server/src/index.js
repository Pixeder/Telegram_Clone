import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js';
import { httpServer } from './socketio.js';

dotenv.config({
  path: './.env',
});

connectDB()
  .then(() => {
    httpServer.listen(process.env.PORT || 8000, () => {
      console.log('Server is running at port: ', process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });
