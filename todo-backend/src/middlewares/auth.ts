import { Request, Response, NextFunction } from "express";
import { verifyAuthToken } from "../utils/jwt";
import { User } from "../models/User";

export interface AuthRequest extends Request {
    user?: { id: string; tokenVersion?: number };
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
        const token = header.split(" ")[1];
        const payload = verifyAuthToken<{ id: string; tokenVersion?: number }>(token);
        const user = await User.findById(payload.id).select("tokenVersion");
        if (!user) return res.status(401).json({ error: "Unauthorized" });
        if (payload.tokenVersion !== undefined && payload.tokenVersion !== user.tokenVersion) {
            return res.status(401).json({ error: "Token invalidated" });
        }
        req.user = { id: payload.id, tokenVersion: user.tokenVersion };
        return next();
    } catch (err) {
        return res.status(401).json({ error: "Unauthorized" });
    }
}
