import express from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { User } from "../models/User";
import { signAuthToken } from "../utils/jwt";
import { validateBody } from "../middlewares/validate";
import { signupSchema, loginSchema, forgotSchema, resetSchema } from "../validators/authValidators";
import { sendResetEmail } from "../utils/mailer";
import { logErrorToDB } from "../utils/logger";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";

const router = express.Router();
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 12);
const RESET_EXPIRE_MIN = Number(process.env.RESET_TOKEN_EXPIRE_MIN || 30);
const IS_PROD = process.env.NODE_ENV === "production";

const forgotLimiter = rateLimit({
    // In production: default to 60 minutes, max 5
    // In development: either disabled (default) or relaxed to 1 minute / 100 req if ENABLE_FORGOT_LIMIT=true
    windowMs: (Number(process.env.RATE_LIMIT_FORGOT_WINDOW_MIN || (IS_PROD ? 60 : 1)) * 60 * 1000),
    max: Number(process.env.RATE_LIMIT_FORGOT_MAX || (IS_PROD ? 5 : 100)),
    message: { error: "Too many password reset requests, try later" },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: any) => {
        const email = req.body?.email;
        if (email) return String(email).toLowerCase();
        return ipKeyGenerator(req);
    },
    skip: () => !IS_PROD && process.env.ENABLE_FORGOT_LIMIT !== "true",
});

router.post("/signup", validateBody(signupSchema), async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ error: "Email already in use" });
        const hashed = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await User.create({ email, password: hashed, name });
        const token = signAuthToken({ id: (user._id as any).toString(), tokenVersion: user.tokenVersion });
        res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name } });
    } catch (err) {
        await logErrorToDB(err, { route: "/signup" }).catch(() => { });
        res.status(500).json({ error: "Signup failed" });
    }
});

router.post("/login", validateBody(loginSchema), async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(401).json({ error: "Invalid credentials" });
        const token = signAuthToken({ id: (user._id as any).toString(), tokenVersion: user.tokenVersion });
        res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
    } catch (err) {
        await logErrorToDB(err, { route: "/login" }).catch(() => { });
        res.status(500).json({ error: "Login failed" });
    }
});

router.post("/forgot", forgotLimiter, validateBody(forgotSchema), async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.json({ ok: true });
        const token = crypto.randomBytes(32).toString("hex");
        const hashed = crypto.createHash("sha256").update(token).digest("hex");
        user.resetPasswordToken = hashed;
        user.resetPasswordExpires = new Date(Date.now() + RESET_EXPIRE_MIN * 60 * 1000);
        await user.save();
        const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5174"}/reset?token=${token}&id=${user._id}`;
        const html = `<p>You requested a password reset. Use this link (valid ${RESET_EXPIRE_MIN} minutes):</p><p><a href="${resetUrl}">${resetUrl}</a></p>`;
        const info = await sendResetEmail(user.email, "Password reset", html);
        return res.json({ ok: true, preview: info.previewUrl });
    } catch (err) {
        await logErrorToDB(err, { route: "/forgot" }).catch(() => { });
        return res.status(500).json({ error: "Failed to process reset request" });
    }
});

router.post("/reset", validateBody(resetSchema), async (req, res) => {
    try {
        const { token, password } = req.body;
        const hashed = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
            resetPasswordToken: hashed,
            resetPasswordExpires: { $gt: new Date() },
        });
        if (!user) return res.status(400).json({ error: "Invalid or expired token" });
        user.password = await bcrypt.hash(password, SALT_ROUNDS);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        user.tokenVersion = (user.tokenVersion || 0) + 1; // invalidate old tokens
        await user.save();
        return res.json({ ok: true });
    } catch (err) {
        await logErrorToDB(err, { route: "/reset" }).catch(() => { });
        return res.status(500).json({ error: "Reset failed" });
    }
});

// optional: change password while logged in
import { requireAuth } from "../middlewares/auth";
router.post("/change-password", requireAuth, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body as { oldPassword: string; newPassword: string };
        if (!oldPassword || !newPassword) return res.status(400).json({ error: "Provide old and new password" });
        // @ts-ignore
        const user = await User.findById(req.user!.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        const ok = await bcrypt.compare(oldPassword, user.password);
        if (!ok) return res.status(401).json({ error: "Incorrect old password" });
        user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
        user.tokenVersion = (user.tokenVersion || 0) + 1; // invalidate old tokens
        await user.save();
        return res.json({ ok: true });
    } catch (err) {
        await logErrorToDB(err, { route: "/change-password" }).catch(() => { });
        return res.status(500).json({ error: "Unable to change password" });
    }
});

export default router;
