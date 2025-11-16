import { ZodType } from "zod";
import { RequestHandler } from "express";

export const validateBody =
    (schema: ZodType<any>): RequestHandler =>
        (req, res, next) => {
            try {
                req.body = schema.parse(req.body);
                next();
            } catch (err) {
                return res.status(400).json({ error: (err as any).errors ?? (err as any).message });
            }
        };
