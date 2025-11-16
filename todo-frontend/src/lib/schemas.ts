import { z } from "zod";


// auth
export const signupSchema = z.object({
    name: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6),
});


export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});


export const forgotSchema = z.object({ email: z.string().email() });
export const resetSchema = z.object({ token: z.string(), password: z.string().min(6) });


// todo
export const createTodoSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    dueDate: z.string().optional(),
});


export const updateTodoSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    dueDate: z.string().optional(),
    completed: z.boolean().optional(),
});


// responses
export const authResponseSchema = z.object({
    token: z.string(),
    user: z.object({ id: z.string(), email: z.string(), name: z.string().nullable().optional() }),
});


export const todosListSchema = z.object({ todos: z.array(z.any()) });