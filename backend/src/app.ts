import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import { errorHandlingMiddleware } from './middleware/error-handler';
import { notFoundMiddleware } from './middleware/not-found';

const MONGODB_ACCESS_STR = process.env['MONGODB_URI'];
const PORT = process.env.APPLICATION_PORT || 3000;

if (!MONGODB_ACCESS_STR) {
  console.error('Error: MONGODB_ACCESS_STR is not defined.');
  process.exit(1);
}

const app = express();

app.use(bodyParser.json());

app.use(errorHandlingMiddleware);
app.use(notFoundMiddleware);

mongoose
  .connect(MONGODB_ACCESS_STR, {
    dbName: 'repair-service',
    serverApi: {
      version: '1',
      strict: true,
      deprecationErrors: true
    }
  })
  .then(() => {
    console.log(`Server running on port ${PORT}`);
    app.listen(PORT);
  })
  .catch((error) => {
    console.log(error);
  });
