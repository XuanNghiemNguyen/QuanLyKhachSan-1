const db = require("../utils/database");

module.exports = {
  getAllRoom: () => db.load(`SELECT r.*, c.name_category_room, c.price_category_room from Rooms r, CategoriesRoom c WHERE r.category_id = c.idCategoriesRoom`),
  addOneRoom: (entity) => db.add(`Rooms`, entity),
};
