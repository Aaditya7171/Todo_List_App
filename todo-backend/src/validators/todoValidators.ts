import { z } from "zod";

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
