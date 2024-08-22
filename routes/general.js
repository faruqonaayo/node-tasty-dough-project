import express from "express";
import { body } from "express-validator";

import * as generalControllers from "../controllers/general.js";

const router = express.Router();

router.get("/bakery", generalControllers.getBakery);

router.get("/cart", generalControllers.getCart);
router.post(
  "/add-to-cart",
  [body("id").isNumeric()],
  generalControllers.postAddToCart
);

router.post(
  "/change-dozen-qty",
  [body("cartProductId").isNumeric(), body("doz_quantity").isNumeric()],
  generalControllers.postChangeDozQuantity
);

router.post(
  "/remove-from-cart",
  [body("cartProductId").isNumeric()],
  generalControllers.postRemoveCartProduct
);

router.get('/order-form', generalControllers.getOrderForm)

export default router;
