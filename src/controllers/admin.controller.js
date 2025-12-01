const Deal = require("../models/Deal");
const User = require("../models/user");

// GET /api/admin/deals/pending
exports.getPendingDeals = async (req, res) => {
  try {
    const deals = await Deal.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .populate("authorId", "username email");

    res.json(deals);
  } catch (error) {
    console.error("getPendingDeals error:", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// PATCH /api/admin/deals/:id/moderate
// body: { status: "approved" | "rejected" }
exports.moderateDeal = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Status invalide (approved ou rejected)" });
    }

    const deal = await Deal.findById(req.params.id);
    if (!deal) {
      return res.status(404).json({ message: "Deal non trouvé" });
    }

    deal.status = status;
    await deal.save();

    res.json(deal);
  } catch (error) {
    console.error("moderateDeal error:", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// GET /api/admin/users?page=&limit=
exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "10", 10);
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().sort({ createdAt: -1 }).skip(skip).limit(limit).select("-password"),
      User.countDocuments(),
    ]);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: users,
    });
  } catch (error) {
    console.error("getUsers error:", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// PATCH /api/admin/users/:id/role
// body: { role: "user" | "moderator" | "admin" }
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user", "moderator", "admin"].includes(role)) {
      return res.status(400).json({ message: "Rôle invalide" });
    }

    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    user.role = role;
    await user.save();

    res.json(user);
  } catch (error) {
    console.error("updateUserRole error:", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
