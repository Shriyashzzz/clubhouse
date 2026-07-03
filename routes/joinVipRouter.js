import { Router } from "express";
import { joinVipController } from "../controllers/joinVipController.js";
import { checkIfUserSignedIn } from "../session/authenticateUser.js";
export const joinVipRouter = Router();

joinVipRouter.get("/", checkIfUserSignedIn, (req, res) => {
  res.render("joinVip.ejs");
});

joinVipRouter.post("/", checkIfUserSignedIn, joinVipController);
