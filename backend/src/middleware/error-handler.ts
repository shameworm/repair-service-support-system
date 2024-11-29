import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../models/http-error';

export const errorHandlingMiddleware = (
  error: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
};
