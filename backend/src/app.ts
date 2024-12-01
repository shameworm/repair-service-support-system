import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

import { router as equipmentRouter } from './routes/equipment.routes';
import { router as techniciansRouter } from './routes/technician.routes';
import { router as authRouter } from './routes/auth.routes';
import { router as inventoryRouter } from './routes/inventory.routes';
import { router as maintanceRouter } from './routes/maintance.routes';
import { router as reportRouter } from './routes/report.routes';

import { errorHandlingMiddleware } from './middleware/error-handler';
import { notFoundMiddleware } from './middleware/not-found';
import { checkAuth } from './middleware/auth';
import path from 'path';

const MONGODB_ACCESS_STR = process.env['MONGODB_URI'];
const PORT = 5000;

if (!MONGODB_ACCESS_STR) {
  console.error('Error: MONGODB_ACCESS_STR is not defined.');
  process.exit(1);
}

const app = express();

app.use(bodyParser.json());

app.use('/api', authRouter);

app.use(checkAuth);
app.use('/api', techniciansRouter);
app.use('/api', equipmentRouter);
app.use('/api', inventoryRouter);
app.use('/api', maintanceRouter);
app.use('/api', reportRouter);

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
