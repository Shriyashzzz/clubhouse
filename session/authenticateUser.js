import LocalStrategy from "passport-local";
import { pool } from "../models/pool.js";
import bcrypt from "bcryptjs";
//runs this function when you call passport.authenticate

export const checkIfUserExists = new LocalStrategy(
  async (username, password, done) => {
    try {
      const { rows } = await pool.query(
        `
        SELECT id, username, password FROM users 
        WHERE username = $1;
            `,
        [username],
      );
      const user = rows[0];

      if (user) {
        const isValid = bcrypt.compare(password, user.password);
        if (isValid) {
          return done(null, user);
        } else {
          return done(null, false, { message: "incorrect password" });
        }
      } else {
        return done(null, false, { message: "incorrect username" });
      }
    } catch (err) {
      return done(err);
    }
  },
);

//defines what to store as a session if the the authenticator finds the login valid
export const serializer = (user, done) => {
  done(null, user.id);
};

//runs on every server requsest to validate the session id of the user

export const getThatUser = async (id, done) => {
  try {
    const { rows } = pool.query(
      `
            SELECT * FROM users 
            WHERE id = $1
            `,
      [id],
    );
    const user = rows[0];
    done(null, user);
  } catch (err) {
    done(err);
  }
};
