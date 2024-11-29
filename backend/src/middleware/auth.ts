import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { HttpError } from '../models/http-error';
import { Technician } from '../models/technician.schema';
import { AuthRequest } from '../types/custom';

interface JwtPayload {
  userId: string;
  contactInfo: string;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new HttpError('Authentication failed! Token missing.', 401);
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;
    const user = await Technician.findById(decodedToken.userId);

    if (!user) {
      throw new HttpError('User not found', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new HttpError('Authentication failed!', 401));
  }
};
