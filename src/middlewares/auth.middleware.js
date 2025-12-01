const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant ou invalide" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Utilisateur introuvable" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("JWT error:", error.message);
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
};

// 🔹 nouveau : auth facultative (ne plante pas si pas de token)
const optionalAuthenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // pas de token → on laisse passer sans user
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (user) {
      req.user = user;
    }
  } catch (error) {
    console.warn("optionalAuthenticate: token invalide, ignoré");
  }

  next();
};

const requireRole = (roles = []) => {
  if (!Array.isArray(roles)) roles = [roles];
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Accès refusé" });
    }
    next();
  };
};

module.exports = {
  authenticate,
  optionalAuthenticate, // ⬅️ NE PAS OUBLIER
  requireRole,
};
