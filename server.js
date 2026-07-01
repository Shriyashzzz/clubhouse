import express from "express";
import path from "node:path";
import passport from "passport";
import { signUpRouter } from "./routes/handleSignUpRouter.js";
import { handleLogInRouter } from "./routes/handleLogInRouter.js";
import session from "express-session";
import {
  checkIfUserExists,
  getThatUser,
  serializer,
} from "./session/authenticateUser.js";
import { check } from "express-validator";
export const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(import.meta.dirname, "views"));
app.set("view engine", "ejs");

//*----------------------------------for passport local strategy------------------------------------------------*
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {},
  }),
);
//"installs" passport into Express's request/response cycle.
app.use(passport.initialize());
app.use(passport.session());
//tells passport which strategy to use
passport.use(checkIfUserExists);
// tells passport what to store in the req.passport.whatever-you-choose-in-this-function
passport.serializeUser(serializer);
//serialize user gives this function whatever you stored, and desirialize user needs to get the needed stuff out of it.
// EX: serialze user saves user.id, now use that user.id to query and get the whole user object
passport.deserializeUser(getThatUser);
//*--------------------------------------------------------------------------------------------------------------------*
app.use("/", (req, res) => {
  res.render("home.ejs");
});
app.use("/signup", signUpRouter);
app.use("/login", handleLogInRouter);

app.listen(process.env.PORT, () => {
  console.log(`This app is running on https://localhost:${process.env.PORT}`);
});
