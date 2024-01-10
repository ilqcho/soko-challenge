import { Response } from 'express';

export const handleError = (res: Response, message: string, error: any) => {
    console.error(message, error);
    return res.status(500).json({ message, error });
};