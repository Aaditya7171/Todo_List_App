import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    email: string;
    password: string;
    name?: string;
    tokenVersion: number;
    resetPasswordToken?: string | null;
    resetPasswordExpires?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true },
        name: { type: String },
        tokenVersion: { type: Number, default: 0 },
        resetPasswordToken: { type: String, default: null },
        resetPasswordExpires: { type: Date, default: null },
    },
    { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
