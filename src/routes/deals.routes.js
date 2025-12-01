const express = require("express");
const router = express.Router();

const dealController = require("../controllers/deal.controller");
const { authenticate, optionalAuthenticate } = require("../middlewares/auth.middleware");


const {
  createDealValidation,
  updateDealValidation,
} = require("../validators/deal.validator");

router.get("/search", optionalAuthenticate, dealController.searchDeals);

// GET /api/deals → liste des deals approuvés (publique)
router.get("/", optionalAuthenticate, dealController.getDeals);

// GET /api/deals/:id → détails d'un deal
router.get("/:id", optionalAuthenticate, dealController.getDealById);


router.post("/", authenticate, createDealValidation, dealController.createDeal);

router.put("/:id", authenticate, updateDealValidation, dealController.updateDeal);

router.delete("/:id", authenticate, dealController.deleteDeal);

// Votes
router.post("/:id/vote", authenticate, dealController.voteDeal);
router.delete("/:id/vote", authenticate, dealController.removeVote);


module.exports = router;
