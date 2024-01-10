import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function startConnection(){
    try{
        await mongoose.connect(process.env.DATABASE || 'mongodb://127.0.0.1:27017/sokodb');
        console.log('Database is connected');
    } catch(e){
        console.log(e);
    }
}

