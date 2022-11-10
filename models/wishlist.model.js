const { query } = require("../utils/db");

const createOne = (ID_PRODUIT_PARTENAIRE,ID_USERS) => {
          try {
                    var sqlQuery = "INSERT INTO ecommerce_wishlist_produit(ID_PRODUIT_PARTENAIRE, ID_USERS) "
                   sqlQuery += " VALUES (?,?)";
                    return query(sqlQuery, [ID_PRODUIT_PARTENAIRE,ID_USERS])
          }
          catch (error) {

                    throw error
          }
}
const findById = async (id) => {
          try {
                    return query("SELECT * FROM  ecommerce_wishlist_produit WHERE ID_WISHLIST=?", [id]);
          } catch (error) {
                    throw error;
          }
}

const createOneResto = (ID_RESTAURANT_MENU,ID_USERS) => {
  try {
            var sqlQuery = "INSERT INTO restaurant_wishlist_menu(ID_RESTAURANT_MENU, ID_USERS) "
           sqlQuery += " VALUES (?,?)";
            return query(sqlQuery, [ID_RESTAURANT_MENU,ID_USERS])
  }
  catch (error) {

            throw error
  }
}
const findByIdResto = async (id) => {
  try {
            return query("SELECT * FROM  restaurant_wishlist_menu WHERE ID_WISHLIST=?", [id]);
  } catch (error) {
            throw error;
  }
};
module.exports = {
        createOne,
          findById,
          createOneResto,
          findByIdResto,
}