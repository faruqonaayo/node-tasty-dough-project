import express from "express";

import * as generalControllers from "../controllers/general.js";

const router = express.Router();

router.get("/bakery", generalControllers.getBakery);

router.get("/add-to-cart/:id", generalControllers.getAddToCart)

export default router;
