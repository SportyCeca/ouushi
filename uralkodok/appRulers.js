
import express from "express";
import * as db from "./data/dbRulers.js";

const router = express.Router();
const userRouter = express.Router();

router.get("/", (req, res) => {
    const rulers = db.GetAllPublicRulers();
    res.status(200).json(rulers);
});

router.get("/:id", (req, res) => {
    const ruler = db.GetPublicRulerById(+req.params.id);

    if (!ruler) {
        return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(ruler);
});

userRouter.use((req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "Login required" });
    }

    next();
});

userRouter.get("/:userId", (req, res) => {
    const userId = +req.params.userId;

    if (userId !== req.session.userId) {
        return res.status(403).json({ message: "Forbidden" });
    }

    const rulers = db.GetAllUserRulers(userId);
    res.status(200).json(rulers);
});

userRouter.post("/", (req, res) => {
    const { name, reign, empire, image, isPublic } = req.body;

    if (!name || !reign || !empire || isPublic === undefined) {
        return res.status(400).json({ message: "Missing data" });
    }

    const saved = db.SaveUserRuler(
        name,
        reign,
        empire,
        image || "",
        Number(isPublic),
        req.session.userId
    );

    res.status(201).json({
        message: "Ruler saved",
        changes: saved.changes
    });
});

userRouter.put("/:userId/:id", (req, res) => {
    const userId = +req.params.userId;
    const id = +req.params.id;

    if (userId !== req.session.userId) {
        return res.status(403).json({ message: "Forbidden" });
    }

    const { name, reign, empire, image, isPublic } = req.body;

    if (!name || !reign || !empire || isPublic === undefined) {
        return res.status(400).json({ message: "Missing data" });
    }

    const ruler = db.GetUserRulerById(userId, id);

    if (!ruler) {
        return res.status(404).json({ message: "Ruler not found" });
    }

    const updated = db.UpdateUserRuler(
        name,
        reign,
        empire,
        image || "",
        Number(isPublic),
        userId,
        id
    );

    res.status(200).json({
        message: "Ruler updated",
        changes: updated.changes
    });
});

userRouter.delete("/:userId/:id", (req, res) => {
    const userId = +req.params.userId;
    const id = +req.params.id;

    if (userId !== req.session.userId) {
        return res.status(403).json({ message: "Forbidden" });
    }

    const ruler = db.GetUserRulerById(userId, id);

    if (!ruler) {
        return res.status(404).json({ message: "Ruler not found" });
    }

    const deleted = db.DeleteUserRuler(userId, id);

    res.status(200).json({
        message: "Ruler deleted",
        changes: deleted.changes
    });
});

export default router;
export const userRulers = userRouter;
