import { Request, Response, NextFunction } from "express";
import { logErrorToDB } from "../utils/logger";

export async function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err);
    await logErrorToDB(err, { path: req.path, body: req.body, params: req.params }).catch(() => { });
    const status = err?.status || 500;
    const message = err?.message || "Internal Server Error";
    res.status(status).json({ error: message });
}
