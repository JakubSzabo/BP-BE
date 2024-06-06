import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import articlesRouter from "./routers/articles.router";
import { dbConnect } from "./configs/database.config"
import scriptRouter from "./routers/script.router";
import memberRouter from "./routers/member.router";
import loginRouter from "./routers/login.router";
import aboutRouter from "./routers/about.router";
import fileRouter from "./routers/file.router";
import photoRouter from "./routers/photo.router";
import aboutSDRouter from "./routers/aboutSD.router";
import contactRouter from "./routers/contact.router";
import {UserModel} from "./models/user.model";
import jwt from "jsonwebtoken";
import formRouter from "./routers/form.router";

dbConnect()

// Init app
const app = express();
app.use(express.json({ limit: '10mb' }));

// Only for localhost using
app.use(
    cors(
        {
            credentials: true,
            origin: ["http://localhost:4200"]
        }
    )
);

// Defined all api URLs
app.use("/api/v1/login", loginRouter);
app.use("/api/v1/articles", articlesRouter);
app.use("/api/v1/scripts", scriptRouter);
app.use("/api/v1/member", memberRouter);
app.use("/api/v1/about", aboutRouter);
app.use("/api/v1/file", fileRouter);
app.use("/api/v1/photos", photoRouter);
app.use("/api/v1/aboutSD", aboutSDRouter);
app.use("/api/v1/contacts", contactRouter);
app.use("/api/v1/forms", formRouter);

// Port for local host
const port = 9001;

app.listen(port, () => {
    console.log("Website served on http://localhost:" + port);
});