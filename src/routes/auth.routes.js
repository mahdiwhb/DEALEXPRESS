const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const {
  registerValidation,
  loginValidation,
} = require("../validators/auth.validator");

// POST /api/auth/register
router.post("/register", registerValidation, authController.register);

// POST /api/auth/login
router.post("/login", loginValidation, authController.login);

// GET /api/auth/me
router.get("/me", authenticate, authController.getMe);

module.exports = router;
