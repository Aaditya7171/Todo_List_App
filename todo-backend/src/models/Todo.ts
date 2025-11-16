import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITodo extends Document {
    owner: Types.ObjectId;
    title: string;
    description?: string;
    completed: boolean;
    dueDate?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const TodoSchema = new Schema<ITodo>(
    {
        owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true },
        description: { type: String },
        completed: { type: Boolean, default: false },
        dueDate: { type: Date, default: null },
    },
    { timestamps: true }
);

export const Todo = mongoose.model<ITodo>("Todo", TodoSchema);
