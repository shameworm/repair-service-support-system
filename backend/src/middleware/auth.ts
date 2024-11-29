import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { HttpError } from '../models/http-error';
import { Technician } from '../models/technician.schema';
import { AuthRequest } from '../types/custom';

interface JwtPayload {
  userId: string;
  contactInfo: string;
}

export const checkAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.path === '/signup' || req.path === '/login') {
      return next();
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return next(
        new HttpError('Authentication failed: Token is missing.', 401)
      );
    }

    if (!process.env.JWT_SECRET) {
      throw new HttpError('Server error: Missing JWT secret.', 500);
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as JwtPayload;

    const user = await Technician.findById(decodedToken.userId).select(
      'name contactInfo isAdmin'
    );
    if (!user) {
      return next(new HttpError('Authentication failed: User not found.', 401));
    }

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return next(new HttpError('Authentication failed!', 401));
  }
};
