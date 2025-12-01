const { validationResult } = require("express-validator");
const Deal = require("../models/Deal");
const Vote = require("../models/Vote");

// Recalcule la température d'un deal à partir des votes
const calculateTemperature = async (dealId) => {
  const [hotCount, coldCount] = await Promise.all([
    Vote.countDocuments({ dealId, type: "hot" }),
    Vote.countDocuments({ dealId, type: "cold" }),
  ]);

  const temperature = hotCount - coldCount;
  await Deal.findByIdAndUpdate(dealId, { temperature });

  return { temperature, hotCount, coldCount };
};

// POST /api/deals/:id/vote
exports.voteDeal = async (req, res) => {
  const dealId = req.params.id;
  const { type } = req.body;

  if (!["hot", "cold"].includes(type)) {
    return res
      .status(400)
      .json({ message: "Type de vote invalide (hot ou cold)" });
  }

  try {
    const deal = await Deal.findById(dealId);
    if (!deal) {
      return res.status(404).json({ message: "Deal non trouvé" });
    }

    const existingVote = await Vote.findOne({
      userId: req.user._id,
      dealId,
    });

    if (!existingVote) {
      await Vote.create({
        type,
        userId: req.user._id,
        dealId,
      });
    } else if (existingVote.type === type) {
      // même vote → on laisse comme ça
    } else {
      existingVote.type = type;
      await existingVote.save();
    }

    const stats = await calculateTemperature(dealId);

    res.json({
      dealId,
      voteType: type,
      ...stats,
    });
  } catch (error) {
    console.error("voteDeal error:", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// DELETE /api/deals/:id/vote
exports.removeVote = async (req, res) => {
  const dealId = req.params.id;

  try {
    const deal = await Deal.findById(dealId);
    if (!deal) {
      return res.status(404).json({ message: "Deal non trouvé" });
    }

    const vote = await Vote.findOne({
      userId: req.user._id,
      dealId,
    });

    if (!vote) {
      return res.status(404).json({ message: "Vote non trouvé" });
    }

    await vote.deleteOne();

    const stats = await calculateTemperature(dealId);

    res.json({
      dealId,
      message: "Vote supprimé",
      ...stats,
    });
  } catch (error) {
    console.error("removeVote error:", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// GET /api/deals
// Liste des deals APPROUVÉS, avec pagination
exports.getDeals = async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "10", 10);
    const skip = (page - 1) * limit;

    const role = req.user?.role;
    const filter = {};
    if (!role || role === "user") {
      filter.status = "approved";
    }

    const [deals, total] = await Promise.all([
      Deal.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("authorId", "username"),
      Deal.countDocuments(filter),
    ]);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: deals,
    });
  } catch (error) {
    console.error("getDeals error:", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// GET /api/deals/:id
// Détails d'un deal
exports.getDealById = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id).populate(
      "authorId",
      "username"
    );

    if (!deal) {
      return res.status(404).json({ message: "Deal non trouvé" });
    }

    const user = req.user;

    // Si le deal est approuvé → visible par tous
    if (deal.status === "approved") {
      return res.json(deal);
    }

    // Sinon, il est pending/rejected → contrôles
    const isAuthor =
      user && deal.authorId && deal.authorId._id.toString() === user._id.toString();
    const isModeratorOrAdmin =
      user && (user.role === "moderator" || user.role === "admin");

    if (isAuthor || isModeratorOrAdmin) {
      return res.json(deal);
    }

    // User simple ou non connecté → ne voit pas ce deal
    return res.status(404).json({ message: "Deal non trouvé" });
  } catch (error) {
    console.error("getDealById error:", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


// POST /api/deals
// Création d'un deal (user connecté, status = pending)
exports.createDeal = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, price, originalPrice, url, category } = req.body;

  try {
    const deal = await Deal.create({
      title,
      description,
      price,
      originalPrice,
      url,
      category,
      status: "pending",
      authorId: req.user._id,
    });

    res.status(201).json(deal);
  } catch (error) {
    console.error("createDeal error:", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// PUT /api/deals/:id
exports.updateDeal = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let deal = await Deal.findById(req.params.id);
if (!deal) {
  return res.status(404).json({ message: "Deal non trouvé" });
}

const user = req.user;
const isAuthor = deal.authorId.toString() === user._id.toString();
const isAdmin = user.role === "admin";

// Si pas admin et pas auteur → interdit
if (!isAuthor && !isAdmin) {
  return res.status(403).json({ message: "Vous ne pouvez pas modifier ce deal" });
}

// Si auteur mais deal pas pending → interdit pour user/moderator
if (isAuthor && !isAdmin && deal.status !== "pending") {
  return res.status(400).json({
    message: "Vous ne pouvez modifier un deal que lorsqu'il est en attente (pending)",
  });
}


    // (on ajoutera ici plus tard : vérif ownership + status === pending)

    const fieldsToUpdate = [
      "title",
      "description",
      "price",
      "originalPrice",
      "url",
      "category",
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        deal[field] = req.body[field];
      }
    });

    await deal.save();
    res.json(deal);
  } catch (error) {
    console.error("updateDeal error:", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// DELETE /api/deals/:id
exports.deleteDeal = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
if (!deal) {
  return res.status(404).json({ message: "Deal non trouvé" });
}

const user = req.user;
const isAuthor = deal.authorId.toString() === user._id.toString();
const isAdmin = user.role === "admin";

if (!isAuthor && !isAdmin) {
  return res.status(403).json({
    message: "Vous ne pouvez supprimer que vos propres deals (sauf admin)",
  });
}

await deal.deleteOne();
res.json({ message: "Deal supprimé" });

  } catch (error) {
    console.error("deleteDeal error:", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// GET /api/deals/search?q=...
// Recherche par mot-clé dans title + description
exports.searchDeals = async (req, res) => {
  try {
    const q = req.query.q;
    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Paramètre 'q' requis" });
    }

    const regex = new RegExp(q, "i"); // i = insensible à la casse
    const role = req.user?.role;

    const filter = {
      $or: [{ title: regex }, { description: regex }],
    };

    if (!role || role === "user") {
      filter.status = "approved";
    }

    const results = await Deal.find(filter)
      .sort({ createdAt: -1 })
      .populate("authorId", "username");

    res.json({
      query: q,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("searchDeals error:", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
