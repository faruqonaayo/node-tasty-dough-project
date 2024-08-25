import express from "express";
import multer from "multer";
import { body } from "express-validator";

import * as adminControllers from "../controllers/admin.js";
import { fileStorage, fileFilter } from "../util/multerConfig.js";

const router = express.Router();

const upload = multer({
  storage: fileStorage("uploads/products"),
  fileFilter: fileFilter,
});

router.get("/add-product", adminControllers.getAddProduct);
router.post(
  "/add-product",
  upload.single("productImage"),
  [
    body("productName", "Product name must be between 3 and 50 characters")
      .trim()
      .isLength({ min: 3, max: 50 }),
    body("productCategory", "Input a valid category").custom(
      (value, { req }) => {
        if (
          value === "buns" ||
          value === "bread" ||
          value === "pastries" ||
          value === "cake"
        ) {
          return true;
        }
        return false;
      }
    ),
    body("productPrice", "Price must be a number and greater than 0").custom(
      (value, { req }) => {
        if (Number(value) && Number(value) > 0) {
          return true;
        }
        return false;
      }
    ),
  ],
  adminControllers.postAddProduct
);

router.get("/change-password", adminControllers.getChangePassword);
router.post(
  "/change-password",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be less than 6 characters")
      .trim()
      .isLength({ min: 6 }),
    body("confirmpw", "Password must match").custom((value, { req }) => {
      if (value !== req.body.password) {
        return false;
      }
      return true;
    }),
  ],
  adminControllers.postChangePassword
);

router.post("/delete", adminControllers.postDeleteProduct);

router.get("/orders", adminControllers.getOrders);
router.get("/orders/:id", adminControllers.getOrderDetails);
router.post(
  "/orders/search",
  [body("keyword").isDate()],
  adminControllers.postSearchOrder
);

export default router;
