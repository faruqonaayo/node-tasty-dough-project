import fs from "fs";
import path from "path";

import { validationResult } from "express-validator";

import Product from "../models/product.js";

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
          // handle error properly!!
          if (err) {
            console.log(err);
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
    // handle error better
    next(error);
  }
}
