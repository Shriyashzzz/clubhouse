import express from "express";
import path from "node:path";
import passport from "passport";
import LocalStrategt from "passport-local";
import { signUpRouter } from "./routes/handleSignUpRouter.js";
const app = express();

app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(import.meta.dirname, "views"));
app.set("view engine", "ejs");

app.use("/signup", signUpRouter);

app.listen(process.env.PORT, () => {
  console.log(`This app is running on https://localhost:${process.env.PORT}`);
});
