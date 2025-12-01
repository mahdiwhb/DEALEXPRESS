const { body } = require("express-validator");

// Validation pour /register
const registerValidation = [
  body("username")
    .notEmpty().withMessage("Username est requis")
    .isLength({ min: 3, max: 30 }).withMessage("Username entre 3 et 30 caractères")
    .isAlphanumeric().withMessage("Username alphanumérique uniquement"),
  body("email")
    .notEmpty().withMessage("Email est requis")
    .isEmail().withMessage("Email invalide"),
  body("password")
    .notEmpty().withMessage("Mot de passe requis")
    .isLength({ min: 8 }).withMessage("Mot de passe minimum 8 caractères"),
];

// Validation pour /login
const loginValidation = [
  body("email")
    .notEmpty().withMessage("Email est requis")
    .isEmail().withMessage("Email invalide"),
  body("password")
    .notEmpty().withMessage("Mot de passe requis"),
];

module.exports = {
  registerValidation,
  loginValidation,
};
