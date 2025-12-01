const { body } = require("express-validator");

const createDealValidation = [
  body("title")
    .notEmpty().withMessage("Le titre est requis")
    .isLength({ min: 5, max: 100 }).withMessage("Le titre doit faire entre 5 et 100 caractères"),
  body("description")
    .notEmpty().withMessage("La description est requise")
    .isLength({ min: 10, max: 500 }).withMessage("La description doit faire entre 10 et 500 caractères"),
  body("price")
    .notEmpty().withMessage("Le prix est requis")
    .isFloat({ min: 0 }).withMessage("Le prix doit être un nombre positif"),
  body("originalPrice")
    .optional()
    .isFloat({ min: 0 }).withMessage("Le prix original doit être un nombre positif"),
  body("category")
    .optional()
    .isIn(["High-Tech", "Maison", "Mode", "Loisirs", "Autre"])
    .withMessage("Catégorie invalide"),
];

const updateDealValidation = [
  body("title")
    .optional()
    .isLength({ min: 5, max: 100 }).withMessage("Le titre doit faire entre 5 et 100 caractères"),
  body("description")
    .optional()
    .isLength({ min: 10, max: 500 }).withMessage("La description doit faire entre 10 et 500 caractères"),
  body("price")
    .optional()
    .isFloat({ min: 0 }).withMessage("Le prix doit être un nombre positif"),
  body("originalPrice")
    .optional()
    .isFloat({ min: 0 }).withMessage("Le prix original doit être un nombre positif"),
  body("category")
    .optional()
    .isIn(["High-Tech", "Maison", "Mode", "Loisirs", "Autre"])
    .withMessage("Catégorie invalide"),
];

module.exports = {
  createDealValidation,
  updateDealValidation,
};
