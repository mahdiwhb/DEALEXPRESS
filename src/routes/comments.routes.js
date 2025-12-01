const express = require("express");
const router = express.Router();

const commentController = require("../controllers/comment.controller");
const {
  authenticate,
  optionalAuthenticate,
} = require("../middlewares/auth.middleware");
const {
  createCommentValidation,
  updateCommentValidation,
} = require("../validators/comment.validator");

// GET /api/deals/:dealId/comments
router.get(
  "/deals/:dealId/comments",
  optionalAuthenticate,
  commentController.getCommentsForDeal
);

// POST /api/deals/:dealId/comments
router.post(
  "/deals/:dealId/comments",
  authenticate,
  createCommentValidation,
  commentController.createComment
);

// PUT /api/comments/:id
router.put(
  "/comments/:id",
  authenticate,
  updateCommentValidation,
  commentController.updateComment
);

// DELETE /api/comments/:id
router.delete(
  "/comments/:id",
  authenticate,
  commentController.deleteComment
);

module.exports = router;
