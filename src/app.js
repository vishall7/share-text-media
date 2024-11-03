import express from "express";
import errorHandler from "./utils/errorHandler.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.route.js";

app.use("/api/v1/user", userRouter);

app.use(errorHandler)

export { app }