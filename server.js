import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();

import cors from "cors";
const PORT = process.env.PORT || 8008;

import path from "path";
const __dirname = path.resolve();

// connect mongodb
import { mongoConnect } from "./src/config/mongoDb.js";
mongoConnect();

// middlewares
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname + "/build"));

// API endpoints
import taskRouter from "./src/router/taskRouter.js";
import mongoose from "mongoose";

app.use("/api/v1/task", taskRouter);

app.use("/", (req, res) => {
  // res.json({ message: "Server running healthy" });
  res.sendFile(__dirname + "/index.html");
});

const dbLink =
  process.env.NODE_ENV !== "production"
    ? "mongodb://localhost:27017/nottododb"
    : process.env.MONGO_CLIENT;

mongoose
  .connect(dbLink)
  .then(() => {
    console.log("Mongo Connected.");
    // open port for http request to access the server
    app.listen(PORT, (err) => {
      err
        ? console.log(err.message)
        : console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });
