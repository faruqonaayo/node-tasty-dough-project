import { validationResult } from "express-validator";

import Product from "../models/product.js";
import Cart from "../models/cart.js";

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
    const product = await Cart.addToCart(prodId, req.session.id);
    // console.log(product);

    if (!product) {
      return res.status(422).json({ message: "not successfully added" });
    }
    if (!req.session.total) {
      req.session.total = product.price;
    } else {
      req.session.total += product.price;
    }
    return res.status(201).json({ message: "successfully added" });
  } catch (error) {
    // handle error later
    next(error);
  }
}

export async function getCart(req, res, next) {
  try {
    const cartProducts = await Cart.getUserCartProducts(req.session.id);
    // console.log(cartProducts);
    if (cartProducts) {
      let total = 0;
      cartProducts.forEach((product) => {
        total = total + product.doz_price * product.doz_quantity;
      });
      req.session.total = total.toFixed(2);
      return res.status(200).render("general-views/cart", {
        cartProducts,
        total: req.session.total,
      });
    }
  } catch (error) {
    // handle error later
    next(error);
  }
}

export async function postChangeDozQuantity(req, res, next) {
  try {
    const { errors } = validationResult(req);
    let errorList = errors.map((e) => e.msg);

    const cartProductId = req.body.cartProductId;
    const newDozQuantity = Number(req.body.doz_quantity);
    const cartProduct = await Cart.getOneCartProduct(cartProductId);

    if (
      errorList.length === 0 &&
      cartProduct &&
      cartProduct.session_id === req.session.id
    ) {
      const updatedRecord = await Cart.updateRecord(
        cartProductId,
        "doz_quantity",
        newDozQuantity
      );
    }
    return res.redirect("/cart");
    // next();
  } catch (error) {
    // handle error later
    next(error);
  }
}

export async function postRemoveCartProduct(req, res, next) {
  try {
    const { errors } = validationResult(req);
    let errorList = errors.map((e) => e.msg);
    if (errorList.length > 0) {
      return res.redirect("/cart");
    }

    const cartProductId = req.body.cartProductId;
    const cartProduct = await Cart.removeOneCartProduct(
      req.session.id,
      cartProductId
    );
    return res.redirect("/cart");
  } catch (error) {
    // handle error later
    next(error);
  }
}

export async function getOrderForm(req, res, next) {
  try {
    const cartProducts = await Cart.getUserCartProducts(req.session.id);
    if (cartProducts.length === 0) {
      return res.redirect("/bakery");
    }
    return res.status(200).render("general-views/order-form");
  } catch (error) {
    // handle error later
    next(error);
  }
}
