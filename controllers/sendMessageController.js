import { validationResult, matchedData, body } from "express-validator";
import * as queries from "../models/queries.js";

const validateMiddleWare = [
  body("userMessage").trim().notEmpty().withMessage("Message cannot be empty"),
];

export const sendMessageController = [
  validateMiddleWare,
  async (req, res, next) => {
    if (req.isAuthenticated()) {
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        const { userMessage } = matchedData(req);
        try {
          const date = new Date();
          const currentDate = new Intl.DateTimeFormat("en-GB", {
            dateStyle: "short",
            timeStyle: "short",
          }).format(date);
          await queries.addNewMessage(req.user.id, userMessage, currentDate);
          res.redirect("/");
        } catch (e) {
          next(e);
        }
      } else {
        res.red("/");
      }
    } else {
      next(
        "Error: you are not allowed to send messages, Please sign up to send messages",
      );
    }
  },
];
