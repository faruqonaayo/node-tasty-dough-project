import express from "express";

import * as errorContollers from "../controllers/error.js";

const router = express.Router();

// 404 not found error
router.use(errorContollers.notFound);

// 500 internal server error
router.use(errorContollers.serverError);

export default router;
