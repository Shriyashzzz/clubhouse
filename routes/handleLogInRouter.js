import passport from "passport";
import logInController from "../controllers/logInController.js";
import { Router } from "express";

export const handleLogInRouter = Router();
handleLogInRouter.get("/", logInController.getLoginPage);
handleLogInRouter.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  }),
);
