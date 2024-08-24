import express from "express";
import { body } from "express-validator";
import passport from "passport";
import { Strategy } from "passport-local";
import bcrypt from "bcrypt";

import { db } from "../util/dbConnect.js";

import * as authControllers from "../controllers/auth.js";

const router = express.Router();

router.get("/signup", authControllers.getSignUp);

router.post(
  "/signup",
  [
    body("email", "Enter a valid email").trim().isEmail(),
    body("password", "Password must be a minimum of 6 characters")
      .trim()
      .isLength({ min: 6 }),
    body("confirmpw", "Password must match").custom((value, { req }) => {
      if (value !== req.body.password) {
        return false;
      }
      return true;
    }),
  ],
  authControllers.postSignUp
);

router.get("/login", authControllers.getLogIn);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/admin/add-product",
    failureRedirect: "/auth/login",
  })
);
router.get("/logout", authControllers.getLogOut);

//
passport.use(
  "local",
  new Strategy(async function verify(username, password, cb) {
    try {
      const response = await db.query("SELECT * FROM admin WHERE username=$1", [
        username,
      ]);
      const user = response.rows[0];
      if (!user) {
        //   come back
        return cb("User not found");
      }
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          cb(err);
        } else {
          if (result) {
            return cb(null, user);
          } else {
            return cb(null, false);
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  })
);

passport.serializeUser((user, cb) => {
  return cb(null, user);
});
passport.deserializeUser((user, cb) => {
  return cb(null, user);
});

export default router;
