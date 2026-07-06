import { Router } from "express";
import { messageDeleteController } from "../controllers/mesageController.js";

export const messageRouter = Router();

messageRouter.delete("/:messageId", messageDeleteController);
