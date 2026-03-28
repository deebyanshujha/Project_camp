import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//basic config
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
//cors config
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true, //cookies, login info
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

//import all routes
import healthCheckRouter from "./routes/healthcheck.routes.js";
app.use("/api/v1/healthCheck", healthCheckRouter);

import authRouter from "./routes/auth.routes.js";
app.use("/api/v1/auth", authRouter);

import projectRouter from "./routes/project.routes.js";
app.use("api/v1/projects", projectRouter);

import taskRouter from "./routes/task.routes.js";
app.use("/api/v1/tasks", taskRouter);

import noteRouter from "./routes/note.routes.js";
app.use("/api/v1/notes", noteRouter);

app.get("/instagram", (req, res) => {
  res.send("this is an instagram page");
});

app.get("/", (req, res) => {
  //handles the request
  res.send("Hello World!");
});

export default app;
