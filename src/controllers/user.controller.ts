import {Request, Response} from 'express';
import User, { IUser } from '../models/User';
import { handleError } from '../helpers/handleErrors';
import { isValidEmail } from '../helpers/validateEmail';
import mongoose from 'mongoose';

export const getAllUsers = async(req: Request, res: Response): Promise<Response> => {
    try{
        const users: IUser[] | null = await User.find();
        if(!users) return res.status(404).json({ message: 'Users not found' });
        
        return res.json(users);
    }catch(e){
        return handleError(res, 'Error fetching users: ', e);
    }
}

export const  getUserById = async(req: Request, res: Response): Promise<Response> => {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try{
        const user: IUser | null = await User.findById(userId);
        if(!user) return res.status(404).json({ message: 'User not found' });
    
        return res.json(user);
    }catch(e){
        return handleError(res, 'Error fetching users: ', e);
    }
}

export const createUser = async(req: Request, res: Response): Promise<Response> => {
    const { name, lastName, email, phone } = req.body;
    if (!name || !lastName || !email || !phone) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try{
        const newUser: IUser = new User({
            name,
            lastName,
            email,
            phone,
        });
        const savedUser: IUser = await newUser.save();
    
        return res.status(201).json(savedUser);
    }catch(e){
        return handleError(res, 'Error creating user: ', e);
    }
}

export const deleteUser = async(req: Request, res: Response): Promise<Response> => {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try{
        const user: IUser | null = await User.findByIdAndDelete(userId);
        if(!user) return res.status(404).json({ message: 'User not found' });
    
        return res.json(user);
    }catch(e){
        return handleError(res, 'Error deleting user: ', e);
    }
}

export const updateUser = async(req: Request, res: Response): Promise<Response> => {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    const { email } = req.body;
    if (email && !isValidEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    try{
        const user: IUser | null = await User.findByIdAndUpdate(userId, req.body, {
            new: true,
        });
        if(!user) return res.status(404).json({ message: 'User not found' });
    
        return res.json(user);
    }catch(e){
        return handleError(res, 'Error updating user: ', e);
    }
}