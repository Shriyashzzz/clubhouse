import * as signUpController from "../controllers/signUpController.js";
import { Router } from "express";

export const signUpRouter = Router();

signUpRouter.get("/", signUpController.getSignUpPage);

signUpRouter.post("/", signUpController.postSignUpPage);
