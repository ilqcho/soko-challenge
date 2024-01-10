import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { isValidEmail } from '../helpers/validateEmail';

export const handleValidationError = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }
  next();
};

export const handleMissingFields = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { name, lastName, email, phone } = req.body;
    if (!name || !lastName || !email || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    next();
  };
  
  export const handleInvalidEmailFormat = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { email } = req.body;
    if (email && !isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    next();
  };

export const handleDatabaseError = (
  err: Error,
  req: Request,
  res: Response,
) => {
  console.error('Error in database operation:', err);
  return res.status(500).json({ message: 'Internal server error' });
};