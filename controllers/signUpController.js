import { validationResult, body, matchedData } from "express-validator";
import * as queries from "../models/queries.js";
import bcrypt from "bcryptjs";
import { pool } from "../models/pool.js";
import { hash } from "node:crypto";
const emptyError = `cannot be empty!`;

const validationMiddleware = [
  body("fname").trim().notEmpty().withMessage(`First Name ${emptyError}`),

  body("lname").trim().notEmpty().withMessage(`Last Name ${emptyError}`),

  body("username")
    .trim()
    .notEmpty()
    .withMessage(` Username ${emptyError}`)
    .isLength({ min: 5 })
    .withMessage("Username has to be atleast 5 charachthers long "),
  body("email")
    .isEmail()
    .withMessage("Make sure the email is valid. EX: xyz@email.com"),
  body("password").notEmpty().withMessage(`Password field ${emptyError}`),
  body("cpassword")
    .notEmpty()
    .withMessage(`Confirm password field ${emptyError}`)
    .custom((value, { req }) => {
      const isEqual = value === req.body.password;
      if (!isEqual) {
        throw new Error("Please make sure your passwords match");
      }
      //returning true tells the custom validator that it's valid
      return true;
    }),
];
const getSignUpPage = (req, res) => {
  res.render("signup.ejs");
};

const postSignUpPage = [
  validationMiddleware,
  async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { fname, lname, email, username, password, secret } =
        matchedData(req);

      const userStatus = "MEMBER";
      if (secret == process.env.SECRET_CODE) {
        userStatus = "VIP";
      }
      const hashedPassword = await bcrypt.hash(password, 12);

      const userId = await queries.signUpNewUser(
        fname,
        lname,
        email,
        username,
        hashedPassword,
        userStatus,
      );
      res.redirect("/login");
      return;
    } else {
      console.log(errors);
      res.render("signup.ejs", { errors: errors.array() });
      return;
    }
  },
];

export { getSignUpPage, postSignUpPage };
