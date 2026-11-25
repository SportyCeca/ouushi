
import Database from "better-sqlite3";

const db = new Database("./data/users.db");

db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )
`).run();

export const SaveUser = (username, email, password) =>
    db.prepare(`
        INSERT INTO users (username, email, password)
        VALUES (?, ?, ?)
    `).run(username, email, password);

export const GetUserById = (id) =>
    db.prepare("SELECT id, username, email FROM users WHERE id = ?").get(id);

export const GetUserByEmail = (email) =>
    db.prepare("SELECT * FROM users WHERE email = ?").get(email);

export const GetPwById = (id) =>
    db.prepare("SELECT password FROM users WHERE id = ?").get(id)?.password;
