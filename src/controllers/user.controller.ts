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

export const getUserById = async(req: Request, res: Response): Promise<Response> => {
    try{
        const user: IUser | null = await User.findById(req.params.id);
        if(!user) return res.status(404).json({ message: 'User not found' });
    
        return res.json(user);
    }catch(e){
        return handleError(res, 'Error fetching users: ', e);
    }
}

export const createUser = async(req: Request, res: Response): Promise<Response> => {   
    try{
        console.log('entra controller')
        const { name, lastName, email, phone } = req.body;
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
    try{
        const user: IUser | null = await User.findByIdAndDelete(req.params.id);
        if(!user) return res.status(404).json({ message: 'User not found' });
    
        return res.json(user);
    }catch(e){
        return handleError(res, 'Error deleting user: ', e);
    }
}

export const updateUser = async(req: Request, res: Response): Promise<Response> => {
    try{
        const user: IUser | null = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if(!user) return res.status(404).json({ message: 'User not found' });
    
        return res.json(user);
    }catch(e){
        return handleError(res, 'Error updating user: ', e);
    }
}