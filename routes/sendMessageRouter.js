import { Router } from "express";
import { sendMessageController } from "../controllers/sendMessageController.js";

// Router that handles the message sent by the user/

export const sendMessageRouter = Router();

sendMessageRouter.post("/", sendMessageController);
