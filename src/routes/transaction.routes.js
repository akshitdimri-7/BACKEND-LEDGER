const { Router } = require("express");

const transactionRoutes = Router();

transactionRoutes.post("/",authMiddleware.authMiddleware,transaction);

module.exports = transactionRoutes;
