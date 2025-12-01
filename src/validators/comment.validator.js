const { body } = require("express-validator");

const createCommentValidation = [
  body("content")
    .notEmpty().withMessage("Le contenu est requis")
    .isLength({ min: 3, max: 500 })
    .withMessage("Le commentaire doit faire entre 3 et 500 caractères"),
];

const updateCommentValidation = [
  body("content")
    .notEmpty().withMessage("Le contenu est requis")
    .isLength({ min: 3, max: 500 })
    .withMessage("Le commentaire doit faire entre 3 et 500 caractères"),
];

module.exports = {
  createCommentValidation,
  updateCommentValidation,
};
