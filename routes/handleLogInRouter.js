import passport from "passport";
import logInController from "../controllers/logInController.js";
import { Router } from "express";

export const handleLogInRouter = Router();
// dont be confused: this router is basically handling get request for "/login" route
handleLogInRouter.get("/", logInController.getLoginPage);
handleLogInRouter.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/", //home page
    failureRedirect: "/login",
    failureMessage: true,
  }),
);
