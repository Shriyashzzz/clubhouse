import LocalStrategy from "passport-local";
import { pool } from "../models/pool.js";
import bcrypt from "bcryptjs";

/**
 * AUTH FLOW OVERVIEW
 * ----------------------------------------------------
 * 1. STRATEGY (checkIfUserExists)
 *    Runs once, when the user submits login credentials.
 *    Verifies username/password against the DB.
 *    If valid -> done(null, user) passes the full user object forward.
 *
 * 2. SERIALIZER (serializer)
 *    Runs once, right after a successful login.
 *    Takes the user object from the strategy and picks ONE property
 *    (user.id) to store in the session. This keeps the session small -
 *    only the id lives in the session store / cookie, nothing sensitive.
 *
 * 3. DESERIALIZER (getThatUser)
 *    Runs on EVERY subsequent request (as long as a valid session
 *    cookie is present). Takes the stored id, looks the user back up
 *    in the DB, and passes the result to done(null, user).
 *    Whatever is passed here becomes req.user for that request.
 *
 * NOTE: The deserializer does NOT re-check credentials - the session
 * cookie itself is the proof of a prior valid login. It just re-hydrates
 * the full user object from the id so req.user is available downstream.
 * ----------------------------------------------------
 */

// Incase if you have different name in the front end:
//.  new LocalStrategy(
//     { usernameField: "email", passwordField: "pass" }, //  < = this changes what gets read from req.body
//     async (username, password, done) => { ... } // < = these names still don't matter
//.   )

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
        const isValid = await bcrypt.compare(password, user.password);
        if (isValid) {
          //the second parameter is what gets populated on req.user
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

//convers the user.id into tokes and makes it ready for the cookie to set into the users browsers
export const serializer = (user, done) => {
  return done(null, user.id);
};

//runs on every server requsest to populate req.user
export const getThatUser = async (id, done) => {
  try {
    const { rows } = await pool.query(
      `
            SELECT id, username, email, fname, lname, status  FROM users 
            WHERE id = $1
            `,
      [id],
    );
    const user = rows[0];
    if (!user) {
      return done(null, false);
    }
    //the second parameter is what gets populated on req.user
    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

export const handleLogOut = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
};
// Guardrail: ensures the user is logged in before accessing certain paths
export const checkIfUserSignedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else res.send("Please log in if you want to visit this path");
};
