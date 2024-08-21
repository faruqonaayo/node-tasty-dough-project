import express from "express";
import { body } from "express-validator";

import * as generalControllers from "../controllers/general.js";

const router = express.Router();

router.get("/bakery", generalControllers.getBakery);

router.post(
  "/add-to-cart",
  [body("id").isNumeric()],
  generalControllers.postAddToCart
);

export default router;
