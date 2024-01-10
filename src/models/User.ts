import { Schema, model, Document } from "mongoose";

interface IUserSchema {
    name: string;
    lastName: string;
    email: string;
    phone: string;
}

const userSchema = new Schema<IUserSchema & Document>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

export interface IUser extends IUserSchema, Document {}
export default model<IUser>('User', userSchema);