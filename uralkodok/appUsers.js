
import bcrypt from "bcrypt";
import express from "express";
import * as db from "./data/dbUsers.js";

const router = express.Router();

router.post("/", (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Missing data" });
    }

    try {
        const hashedPassword = bcrypt.hashSync(password, 10);

        const saved = db.SaveUser(username, email, hashedPassword);
        const user = db.GetUserById(saved.lastInsertRowid);

        res.status(201).json(user);
    } catch {
        res.status(400).json({ message: "Email already exists" });
    }
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = db.GetUserByEmail(email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    req.session.userId = user.id;

    res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email
    });
});

router.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.status(200).json({ message: "Logged out" });
    });
});

export default router;
