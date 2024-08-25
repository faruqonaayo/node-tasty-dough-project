import fs from "fs";
import bcrypt from "bcrypt";
import path from "path";

import { validationResult } from "express-validator";

import Product from "../models/product.js";
import Admin from "../models/admin.js";
import Order from "../models/order.js";

export function getAddProduct(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect("/auth/login");
  }

  return res.status(200).render("admin-views/product-form.ejs", {
    error: null,
    preValue: null,
    auth: req.isAuthenticated(),
  });
}

export async function postAddProduct(req, res, next) {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/auth/login");
    }

    const productName = req.body.productName;
    const productCategory = req.body.productCategory;
    const productPrice = Number(req.body.productPrice);
    const productImage = req.file.path.replace("\\", "/");

    const { errors } = validationResult(req);
    let errorList = errors.map((e) => e.msg);
    if (errorList.length > 0 || !req.file) {
      if (req.file) {
        fs.unlink(req.file.path.replace("\\", "/"), (err) => {
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
      if (!req.file) {
        errorList.push("Enter a valid file");
      }
      return res.status(422).render("admin-views/product-form.ejs", {
        error: errorList[0],
        preValue: { productName, productPrice },
        auth: req.isAuthenticated(),
      });
    }

    const newProduct = new Product(
      productName.toLowerCase(),
      productCategory.toLowerCase(),
      productPrice,
      productImage
    );

    const isSaved = await newProduct.save();
    if (isSaved) {
      // console.log(isSaved);
      return res.status(201).redirect("/admin/add-product");
    }
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    error.message = error.message || "Application crashed fix the bug to fix";
    next(error);
  }
}

export async function getChangePassword(req, res, next) {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/auth/login");
    }
    const admin = await Admin.checkForAdmin();
    // console.log(admin);
    return res.status(200).render("admin-views/change-password", {
      error: null,
      auth: req.isAuthenticated(),
      username: admin.username,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    error.message = error.message || "Application crashed fix the bug to fix";
    next(error);
  }
}

export async function postChangePassword(req, res, next) {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/auth/login");
    }
    const adminUsername = req.body.email;
    const newPassword = req.body.password;
    const confirmAdmin = await Admin.checkByEmail(adminUsername);
    const admin = await Admin.checkForAdmin();

    const { errors } = validationResult(req);
    let errorList = errors.map((e) => e.msg);
    if (errorList.length > 0 || !confirmAdmin) {
      if (!confirmAdmin) {
        errorList.push("no admin with such username");
      }
      return res.status(422).render("admin-views/change-password", {
        error: errorList[0],
        auth: req.isAuthenticated(),
        username: admin.username,
      });
    }

    bcrypt.hash(newPassword, 12, async (err, hash) => {
      try {
        if (err) {
          throw err;
        }
        const response = await Admin.changePassword(adminUsername, hash);
        // console.log(response);
        return res.redirect("/admin/add-product");
      } catch (error) {
        error.statusCode = error.statusCode || 500;
        error.message =
          error.message || "Application crashed fix the bug to fix";
        next(error);
      }
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    error.message = error.message || "Application crashed fix the bug to fix";
    next(error);
  }
}

export async function postDeleteProduct(req, res, next) {
  try {
    if (req.isAuthenticated()) {
      const productId = req.body.productId;
      const isProduct = await Product.getOneProduct(productId);
      if (!isProduct) {
        return res.redirect("/bakery");
      }
      fs.unlink(isProduct.imageurl, async (err) => {
        try {
          const response = await Product.deleteProduct(isProduct.id);
          return res.redirect("/bakery");
        } catch (error) {
          next(error);
        }
      });
    }
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    error.message = error.message || "Application crashed fix the bug to fix";
    next(error);
  }
}

export async function getOrders(req, res, next) {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/auth/login");
    }
    const ordersToday = await Order.getOrdersByDate(
      new Date().toISOString().split("T")[0]
    );
    // console.log(ordersToday);

    return res.status(200).render("admin-views/orders", {
      error: null,
      auth: req.isAuthenticated(),
      ordersResult: ordersToday,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    error.message = error.message || "Application crashed fix the bug to fix";
    next(error);
  }
}

export async function getOrderDetails(req, res, next) {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/auth/login");
    }
    const orderId = req.params.id;
    const orderProducts = await Order.getOrderProductsById(orderId);
    // console.log(orderProducts);

    return res.status(200).render("admin-views/order-details", {
      error: null,
      auth: req.isAuthenticated(),
      orderDetails: orderProducts,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    error.message = error.message || "Application crashed fix the bug to fix";
    next(error);
  }
}

export async function postSearchOrder(req, res, next) {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/auth/login");
    }
    const searchDate = req.body.keyword;
    const { errors } = validationResult(req);
    let errorList = errors.map((e) => e.msg);
    if (errorList.length > 0) {
      return res.redirect("/admin/orders");
    }

    const searchResult = await Order.getOrdersByDate(searchDate);
    // console.log(searchResult);

    return res.status(200).render("admin-views/orders", {
      error: null,
      auth: req.isAuthenticated(),
      ordersResult: searchResult,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    error.message = error.message || "Application crashed fix the bug to fix";
    next(error);
  }
}
