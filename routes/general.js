import express from "express";
import { body } from "express-validator";

import * as generalControllers from "../controllers/general.js";

const router = express.Router();

router.get("/bakery", generalControllers.getBakery);

router.post("/search", generalControllers.postSearchResult);

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

router.get("/order-form", generalControllers.getOrderForm);

router.post(
  "/order-form",
  [
    body("fullName", "Name is a minimum of 2 characters").isLength({ min: 2 }),
    body("pickupDate", "Enter a valid date").isDate(),
    body("pickupTime", "Enter a valid time").isTime(),
    body("mobileNumber")
      .isNumeric()
      .withMessage("Mobile number must be numbers only")
      .custom((value, { req }) => {
        if (value.length !== 10) {
          return false;
        }
        return true;
      })
      .withMessage("Enter your 10 digit mobile number"),
  ],
  generalControllers.postOrderForm
);

export default router;
