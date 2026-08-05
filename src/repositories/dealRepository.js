const Deal = require('../models/Deal');

// Cette couche isole le contrôleur de Mongoose : si demain on change
// de BDD, seul ce fichier change, pas les contrôleurs.
module.exports = {
  findAll: (filter = {}) => Deal.find(filter),
  findById: (id) => Deal.findById(id),
  create: (data) => Deal.create(data),
  updateById: (id, data) => Deal.findByIdAndUpdate(id, data, { new: true }),
  deleteById: (id) => Deal.findByIdAndDelete(id),
};
