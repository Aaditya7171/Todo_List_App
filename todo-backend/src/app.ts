import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth";
import todoRoutes from "./routes/todos";
import { errorHandler } from "./middlewares/errorHandler";
import { logErrorToDB } from "./utils/logger";

export async function start(port: number) {
    await connectDB();

    const app = express();

    app.use(cors());
    app.use(express.json());

    app.use((req, res, next) => {
        res.on("finish", () => {
            if (res.statusCode >= 400) {
                logErrorToDB(new Error(`${req.method} ${req.originalUrl} -> ${res.statusCode}`), {
                    status: res.statusCode,
                    method: req.method,
                    path: req.originalUrl,
                    query: req.query,
                    body: req.body,
                }).catch(() => { });
            }
        });
        next();
    });

    app.use(
        rateLimit({
            windowMs: 60 * 1000,
            max: 200,
            standardHeaders: true,
            legacyHeaders: false,
        })
    );

    app.use("/api/auth", authRoutes);
    app.use("/api/todos", todoRoutes);

    app.get("/health", (req, res) => res.json({ ok: true }));

    app.use(errorHandler);

    const server = app.listen(port, () => {
        console.log(`Server listening on ${port}`);
    });

    process.on("unhandledRejection", async (reason) => {
        console.error("Unhandled Rejection:", reason);
        await logErrorToDB(reason as any, { context: "unhandledRejection" }).catch(() => { });
        setTimeout(() => process.exit(1), 2000);
    });

    process.on("uncaughtException", async (err) => {
        console.error("Uncaught Exception:", err);
        await logErrorToDB(err as any, { context: "uncaughtException" }).catch(() => { });
        setTimeout(() => process.exit(1), 2000);
    });

    return server;
}
