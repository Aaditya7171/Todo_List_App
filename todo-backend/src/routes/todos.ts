import express from "express";
import { requireAuth } from "../middlewares/auth";
import { Todo } from "../models/Todo";
import { validateBody } from "../middlewares/validate";
import { createTodoSchema, updateTodoSchema } from "../validators/todoValidators";
import { logErrorToDB } from "../utils/logger";

const router = express.Router();

// all routes require auth
router.use(requireAuth);

router.post("/", validateBody(createTodoSchema), async (req, res) => {
    try {
        // @ts-ignore
        const owner = req.user!.id;
        const { title, description, dueDate } = req.body;
        const todo = await Todo.create({
            owner,
            title,
            description,
            dueDate: dueDate ? new Date(dueDate) : null,
        });
        res.status(201).json({ todo });
    } catch (err) {
        await logErrorToDB(err, { route: "POST /todos" }).catch(() => { });
        res.status(500).json({ error: "Failed to create todo" });
    }
});

router.get("/", async (req, res) => {
    try {
        // @ts-ignore
        const owner = req.user!.id;
        const todos = await Todo.find({ owner }).sort({ createdAt: -1 });
        res.json({ todos });
    } catch (err) {
        await logErrorToDB(err, { route: "GET /todos" }).catch(() => { });
        res.status(500).json({ error: "Failed to fetch todos" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        // @ts-ignore
        const owner = req.user!.id;
        const todo = await Todo.findOne({ _id: id, owner });
        if (!todo) return res.status(404).json({ error: "Not found" });
        res.json({ todo });
    } catch (err) {
        await logErrorToDB(err, { route: "GET /todos/:id" }).catch(() => { });
        res.status(500).json({ error: "Failed to fetch todo" });
    }
});

router.patch("/:id", validateBody(updateTodoSchema), async (req, res) => {
    try {
        const id = req.params.id;
        // @ts-ignore
        const owner = req.user!.id;
        const update = req.body;
        if (update.dueDate) update.dueDate = new Date(update.dueDate);
        const todo = await Todo.findOneAndUpdate({ _id: id, owner }, update, { new: true });
        if (!todo) return res.status(404).json({ error: "Not found" });
        res.json({ todo });
    } catch (err) {
        await logErrorToDB(err, { route: "PATCH /todos/:id" }).catch(() => { });
        res.status(500).json({ error: "Failed to update todo" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        // @ts-ignore
        const owner = req.user!.id;
        const todo = await Todo.findOneAndDelete({ _id: id, owner });
        if (!todo) return res.status(404).json({ error: "Not found" });
        res.json({ ok: true });
    } catch (err) {
        await logErrorToDB(err, { route: "DELETE /todos/:id" }).catch(() => { });
        res.status(500).json({ error: "Failed to delete todo" });
    }
});

export default router;
