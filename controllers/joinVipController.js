import { validationResult, matchedData, body } from "express-validator";
import { makeMemberVip } from "../public/queries.js";

const validationMiddleware = [
  body("secret")
    .trim()
    .notEmpty()
    .withMessage("Secret Code cannot empty")
    .custom((value) => {
      if (value == process.env.SECRET_CODE) {
        return true;
      } else {
        throw new Error("That is not the secret code luv!");
      }
    }),
];

const joinVipController = [
  validationMiddleware,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      await makeMemberVip(req.user.id);
      res.redirect("/");
    } else {
      res.render("joinVip.ejs", { errors: errors.array() });
    }
  },
];

export { joinVipController };
