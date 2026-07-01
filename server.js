import express from "express";
import path from "node:path";
import passport from "passport";
import { signUpRouter } from "./routes/handleSignUpRouter.js";
import { handleLogInRouter } from "./routes/handleLogInRouter.js";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import {
  checkIfUserExists,
  getThatUser,
  handleLogOut,
  serializer,
} from "./session/authenticateUser.js";
import { check } from "express-validator";
import { pool } from "./models/pool.js";
export const app = express();
const pgSession = connectPgSimple(session);
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(import.meta.dirname, "views"));
app.set("view engine", "ejs");

//*----------------------------------for passport local strategy------------------------------------------------*
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new pgSession({
      pool: pool,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  }),
);
//"installs" passport into Express's request/response cycle.
app.use(passport.initialize());
app.use(passport.session());
//tells passport which strategy to use
passport.use(checkIfUserExists);
// tells passport what to store in the req.passport.whatever-you-choose-in-this-function in the session/cookie
passport.serializeUser(serializer);
//serialize user gives this function whatever you stored, and desirialize user needs to get the needed stuff out of it.
// EX: serialze user saves user.id, now use that user.id to query and get the whole user object
passport.deserializeUser(getThatUser);
//*--------------------------------------------------------------------------------------------------------------------*
app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("home.ejs", { user: req.user });
  } else {
    res.render("login.ejs");
  }
});
app.use("/signup", signUpRouter);
app.use("/login", handleLogInRouter);
//controller in authenticateUser.js
app.get("/logout", handleLogOut);

app.listen(process.env.PORT, () => {
  console.log(`This app is running on https://localhost:${process.env.PORT}`);
});
