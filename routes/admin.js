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
    body(
      "productName",
      "Product name must be between 3 and 50 characters"
    ).isLength({ min: 3, max: 50 }),
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

export default router;
