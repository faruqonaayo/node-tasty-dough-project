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
    error.statusCode = error.statusCode || 500;
    error.message = error.message || "Application crashed fix the bug to fix";
    next(error);
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
        try {
          if (err) {
            console.log(err);
          }
          const newAdmin = new Admin(adminEmail, hash);
          const response = await newAdmin.createAdmin();
          // console.log(response);
        } catch (error) {
          error.statusCode = error.statusCode || 500;
          error.message =
            error.message || "Application crashed fix the bug to fix";
          next(error);
        }
      });
    }
    return res.redirect("/auth/login");
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    error.message = error.message || "Application crashed fix the bug to fix";
    next(error);
  }
}

export function getLogIn(req, res, next) {
  try {
    if (req.isAuthenticated()) {
      req.logout((err) => {
        try {
          if (err) {
            throw err;
          }
        } catch (error) {
          error.statusCode = error.statusCode || 500;
          error.message =
            error.message || "Application crashed fix the bug to fix";
          next(error);
        }
      });
    }
    return res.status(200).render("auth-views/login", {
      error: null,
      auth: req.isAuthenticated(),
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    error.message = error.message || "Application crashed fix the bug to fix";
    next(error);
  }
}

export function getLogOut(req, res, next) {
  try {
    if (req.isAuthenticated()) {
      req.logout((err) => {
        try {
          if (err) {
            throw err;
          }
        } catch (error) {
          error.statusCode = error.statusCode || 500;
          error.message =
            error.message || "Application crashed fix the bug to fix";
          next(error);
        }
      });
    }
    return res.redirect("/auth/login");
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    error.message = error.message || "Application crashed fix the bug to fix";
    next(error);
  }
}
