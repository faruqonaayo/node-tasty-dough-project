import { validationResult } from "express-validator";
import bcrtpt from "bcrypt";

import Admin from "../models/admin.js";

export async function getSignUp(req, res, next) {
  try {
    const adminPresent = await Admin.checkForAdmin();
    // console.log(adminPresent);

    if (adminPresent) {
      return res.redirect("/auth/login");
    }
    return res.status(200).render("auth-views/signup", {
      error: null,
      auth: req.isAuthenticated(),
    });
  } catch (error) {
    //   work on this later
    console.log(error);
  }
}

export async function postSignUp(req, res, next) {
  try {
    const { errors } = validationResult(req);
    let errorList = errors.map((e) => e.msg);
    if (errorList.length > 0) {
      return res.status(422).render("auth-views/signup", {
        error: errorList[0],
        auth: req.isAuthenticated(),
      });
    }
    const adminEmail = req.body.email;
    const adminPassword = req.body.password;

    const adminPresent = await Admin.checkForAdmin();
    if (!adminPresent) {
      bcrtpt.hash(adminPassword, 12, async (err, hash) => {
        if (err) {
          console.log(err);
        }
        const newAdmin = new Admin(adminEmail, hash);
        const response = await newAdmin.createAdmin();
        // console.log(response);
      });
    }
    return res.redirect("/auth/login");
  } catch (error) {
    //   work on this later
    console.log(error);
  }
}

export function getLogIn(req, res, next) {
  try {
    if (req.isAuthenticated()) {
      req.logout((err) => {
        if (err) {
          throw err;
        }
      });
    }
    return res.status(200).render("auth-views/login", {
      error: null,
      auth: req.isAuthenticated(),
    });
  } catch (error) {
    next(error);
  }
}

export function getLogOut(req, res, next) {
  try {
    if (req.isAuthenticated()) {
      req.logout((err) => {
        if (err) {
          throw err;
        }
      });
    }
    return res.redirect("/auth/login");
  } catch (error) {
    next(error);
  }
}
