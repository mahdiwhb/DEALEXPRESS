const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");
const { authenticate, requireRole } = require("../middlewares/auth.middleware");

// Routes moderator + admin
router.get(
  "/deals/pending",
  authenticate,
  requireRole(["moderator", "admin"]),
  adminController.getPendingDeals
);

router.patch(
  "/deals/:id/moderate",
  authenticate,
  requireRole(["moderator", "admin"]),
  adminController.moderateDeal
);

// Routes admin only
router.get(
  "/users",
  authenticate,
  requireRole(["admin"]),
  adminController.getUsers
);

router.patch(
  "/users/:id/role",
  authenticate,
  requireRole(["admin"]),
  adminController.updateUserRole
);

module.exports = router;
