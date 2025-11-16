import { z } from "zod";

export const signupSchema = z.object({
    name: z.string().min(1).optional(),
    email: z.string().email(),
    password: z.string().min(6),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export const forgotSchema = z.object({
    email: z.string().email(),
});

export const resetSchema = z.object({
    token: z.string(),
    password: z.string().min(6),
});
