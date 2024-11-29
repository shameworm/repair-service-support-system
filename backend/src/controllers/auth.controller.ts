import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { Technician } from '../models/technician.schema';
import { HttpError } from '../models/http-error';

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  try {
    const { name, specialization, contactInfo, password } = req.body;
    const existingUser = await Technician.findOne({ contactInfo });

    if (existingUser) {
      return next(new HttpError('User already exists', 400));
    }

    const newUser = new Technician({
      name,
      specialization,
      contactInfo,
      password,
      isAdmin: false
    });

    await newUser.save();

    res.status(201).json({ message: 'User singup successfully' });
  } catch (error: any) {
    return next(new HttpError('Error creating user: ' + error.message, 500));
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  try {
    const { contactInfo, password } = req.body;

    const existingUser = await Technician.findOne({ contactInfo });

    if (!existingUser) {
      return next(new HttpError('Invalid credentials, user not found', 401));
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return next(
        new HttpError('Invalid credentials, incorrect password.', 401)
      );
    }

    const token = jwt.sign(
      { userId: existingUser.id, contactInfo: existingUser.contactInfo },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User logged in successfully',
      userId: existingUser,
      contactInfo: existingUser.contactInfo,
      token
    });
  } catch (error: any) {
    return next(
      new HttpError('Error creating equipment: ' + error.message, 500)
    );
  }
};
