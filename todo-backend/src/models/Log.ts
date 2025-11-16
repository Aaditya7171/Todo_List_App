import mongoose, { Schema, Document } from "mongoose";

export interface ILog extends Document {
    level: "error" | "info" | "warn";
    message: string;
    meta?: any;
    stack?: string;
    createdAt: Date;
}

const LogSchema = new Schema<ILog>(
    {
        level: { type: String, enum: ["error", "info", "warn"], default: "error" },
        message: { type: String, required: true },
        meta: { type: Schema.Types.Mixed },
        stack: { type: String },
    },
    { timestamps: true }
);

export const Log = mongoose.model<ILog>("Log", LogSchema, "backend_logs");
