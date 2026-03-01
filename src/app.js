import express from "express";
import cors from "cors";

const app = express();

//basic config
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

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

app.get("/", (req, res) => {
  //handles the request
  res.send("Hello World!");
});

app.get("/instagram", (req, res) => {
  res.send("this is an instagram page");
});

export default app;
