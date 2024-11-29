import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../models/http-error';

export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new HttpError('Could not find this route.', 404);
  next(error);
};
