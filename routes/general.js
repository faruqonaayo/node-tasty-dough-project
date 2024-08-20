import express from "express";

import * as generalControllers from "../controllers/general.js";

const router = express.Router();

router.get("/bakery", generalControllers.getBakery);

export default router;
