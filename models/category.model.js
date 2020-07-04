const db = require("../utils/database");

module.exports = {
  getAllCategoryRoom: () => db.load(`SELECT * from CategoriesRoom`),
  addOneCategory: (entity) => db.add(`CategoriesRoom`, entity),
};
