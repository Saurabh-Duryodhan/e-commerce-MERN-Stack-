import express, { urlencoded } from "express";
import mongoose from "mongoose";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import { authenticate } from "./middlewares/authenticate.middleware.js";
import { getConfig } from "../config/index.js";
import cors from "cors";

const DB_PASS = getConfig("DB_PASS");
const APP_PORT = getConfig("APP_PORT");
import authRouter from "./routers/auth.router.js";

const app = express();
app.use(cors());
app.use(errorHandler);
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use("/auth", authRouter);

app.use((err, req, res, next) => {
  if (err) {
    console.log(err);
    return next(500, "Internal Server Error");
  }
  next();
});

try {
  mongoose
    .connect(
      `mongodb+srv://srduryodhan97:${DB_PASS}@cluster0.nsujzan.mongodb.net/`
    )
    .then(() => {
      console.log(`Database connection established successfully!`);
      app.listen(APP_PORT, () =>
        console.log(
          `Server started at port number: ${APP_PORT}\nCheck server at http://localhost:${APP_PORT}`
        )
      );
    });
} catch (error) {
  throw new Error(error.message);
}
