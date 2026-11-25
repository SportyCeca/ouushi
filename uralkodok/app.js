
import express from "express";
import session from "express-session";
import users from "./appUsers.js";
import rulers, { userRulers } from "./appRulers.js";

const app = express();
const PORT = 3300;

app.use(express.json());

app.use(session({
    secret: "uralkodok-titkos-kulcs",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(express.static("index"));

app.use("/api/users", users);
app.use("/api/rulers", rulers);
app.use("/api/users/rulers", userRulers);

app.listen(PORT, () => {
    console.log(`Server runs on port: ${PORT}`);
});
