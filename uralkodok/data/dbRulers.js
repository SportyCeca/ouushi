
import Database from "better-sqlite3";

const db = new Database("./data/rulers.db");

db.prepare(`
    CREATE TABLE IF NOT EXISTS rulers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        reign TEXT NOT NULL,
        empire TEXT NOT NULL,
        image TEXT,
        isPublic INTEGER NOT NULL,
        userId INTEGER NOT NULL
    )
`).run();

export const GetAllUserRulers = (userId) =>
    db.prepare("SELECT * FROM rulers WHERE userId = ?").all(userId);

export const GetAllPublicRulers = () =>
    db.prepare("SELECT * FROM rulers WHERE isPublic = 1").all();

export const GetUserRulerById = (userId, id) =>
    db.prepare("SELECT * FROM rulers WHERE userId = ? AND id = ?").get(userId, id);

export const GetPublicRulerById = (id) =>
    db.prepare("SELECT * FROM rulers WHERE id = ? AND isPublic = 1").get(id);

export const SaveUserRuler = (name, reign, empire, image, isPublic, userId) =>
    db.prepare(`
        INSERT INTO rulers (name, reign, empire, image, isPublic, userId)
        VALUES (?, ?, ?, ?, ?, ?)
    `).run(name, reign, empire, image, isPublic, userId);

export const UpdateUserRuler = (name, reign, empire, image, isPublic, userId, id) =>
    db.prepare(`
        UPDATE rulers
        SET name = ?, reign = ?, empire = ?, image = ?, isPublic = ?
        WHERE userId = ? AND id = ?
    `).run(name, reign, empire, image, isPublic, userId, id);

export const DeleteUserRuler = (userId, id) =>
    db.prepare("DELETE FROM rulers WHERE userId = ? AND id = ?").run(userId, id);
