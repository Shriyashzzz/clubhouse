import { validationResult, body, matchedData } from "express-validator";
import queries from "../public/queries.js";
import bcrypt from "bcryptjs";
import { pool } from "./pool.js";
const emptyError = `cannot be empty!`;

//add minimum/maximum length erro rmessage
const validationMiddleware = [
  body("fname")
    .trim()
    .notEmpty()
    .withMessage(`First Name ${emptyError}`)
    .isLength({ min: 2, max: 0 }),

  body("lname")
    .trim()
    .notEmpty()
    .withMessage(`Last Name ${emptyError}`)
    .isLength({ min: 2, max: 0 }),
  body("username")
    .trim()
    .notEmpty()
    .withMessage(` Username ${emptyError}`)
    .isLength({ min: 2, max: 0 }),
  body("password")
    .trim()
    .notEmpty()
    .withMessage(`Password field ${emptyError}`),
  body("cpassword")
    .trim()
    .notEmpty()
    .withMessage(`Confirm password field ${emptyError}`)
    .custom((value, { req }) => {
      const isEqual = value === req.body.password;
      if (!isEqual) {
        throw new Error("Please make sure your passwords match");
      }
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
      const userId = await queries.signUpNewUser(
        fname,
        lname,
        email,
        username,
        password,
        userStatus,
      );
      res.render("signup.ejs", { errors: [] });
      return;
    } else {
      console.log(errors);
      res.render("signup.ejs", { errors: errors.array() });
      return;
    }
  },
];

export { getSignUpPage, postSignUpPage };
