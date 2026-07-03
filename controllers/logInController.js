import * as queries from "../models/queries.js";
import { validationResult, body, matchedData } from "express-validator";
const getLoginPage = (req, res) => {
  res.render("login.ejs");
};
const emptyError = "cannot be empty";

const validationMiddleware = [
  body("username").trim().notEmpty().withMessage(` Username ${emptyError}`),
  body("password").notEmpty().withMessage(`Password field ${emptyError}`),
];

export default { getLoginPage };
