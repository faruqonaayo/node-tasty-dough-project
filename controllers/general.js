import { validationResult } from "express-validator";

import Product from "../models/product.js";

export async function getBakery(req, res, next) {
  try {
    const allProducts = await Product.getAllProducts();
    // console.log(allProducts);
    res.status(200).render("general-views/bakery", { allProducts });
  } catch (error) {
    // handle error later
    next(error);
  }
}

export async function postAddToCart(req, res, next) {
  try {
    const { errors } = validationResult(req);
    let errorList = errors.map((e) => e.msg);
    if (errorList.length > 0) {
      return res.status(422).json({ message: errorList[0] });
    }

    const prodId = Number(req.body.id);
    const product = await Product.addToCart(prodId, req.session.id);
    // console.log(product);
    if (!product) {
      return res.status(422).json({ message: "not successfully added" });
    }
    return res.status(201).json({ message: "successfully added" });
  } catch (error) {
    // handle error later
    next(error);
  }
}
