import express from "express";

import * as errorContollers from "../controllers/error.js";

const router = express.Router();

// 404 not found error
router.use(errorContollers.notFound);

export default router;
