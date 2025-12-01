const { validationResult } = require("express-validator");
const Comment = require("../models/Comment");
const Deal = require("../models/Deal");

// GET /api/deals/:dealId/comments
exports.getCommentsForDeal = async (req, res) => {
  try {
    const dealId = req.params.dealId;

    const comments = await Comment.find({ dealId })
      .sort({ createdAt: -1 })
      .populate("authorId", "username");

    res.json(comments);
  } catch (error) {
    console.error("getCommentsForDeal error:", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// POST /api/deals/:dealId/comments
exports.createComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const dealId = req.params.dealId;
  const { content } = req.body;

  try {
    const deal = await Deal.findById(dealId);
    if (!deal) {
      return res.status(404).json({ message: "Deal non trouvé" });
    }

    const comment = await Comment.create({
      content,
      dealId,
      authorId: req.user._id,
    });

    const populated = await comment.populate("authorId", "username");

    res.status(201).json(populated);
  } catch (error) {
    console.error("createComment error:", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// PUT /api/comments/:id
exports.updateComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Commentaire non trouvé" });
    }

    const isAuthor =
      comment.authorId.toString() === req.user._id.toString();
    if (!isAuthor) {
      return res.status(403).json({
        message: "Vous ne pouvez modifier que vos propres commentaires",
      });
    }

    comment.content = req.body.content;
    await comment.save();

    const populated = await comment.populate("authorId", "username");

    res.json(populated);
  } catch (error) {
    console.error("updateComment error:", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// DELETE /api/comments/:id
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Commentaire non trouvé" });
    }

    const isAuthor =
      comment.authorId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        message:
          "Vous ne pouvez supprimer que vos commentaires (sauf admin)",
      });
    }

    await comment.deleteOne();

    res.json({ message: "Commentaire supprimé" });
  } catch (error) {
    console.error("deleteComment error:", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
