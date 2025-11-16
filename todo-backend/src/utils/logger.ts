import { Log } from "../models/Log";

export async function logErrorToDB(err: any, meta: any = {}) {
    try {
        const message = err?.message || String(err);
        const stack = err?.stack || (typeof err === "string" ? undefined : JSON.stringify(err));
        await Log.create({
            level: "error",
            message,
            meta,
            stack,
        });
    } catch (e) {
        console.error("Failed to write error log to DB:", e);
    }
}
