import dotenv from "dotenv";
dotenv.config();
import { start } from "./app";

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

start(PORT).catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});
