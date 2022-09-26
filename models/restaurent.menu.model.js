const { query } = require("../utils/db");

const createMenu = (ID_CATEGORIE_MENU,ID_SOUS_CATEGORIE_MENU,ID_SOUS_SOUS_CATEGORIE,ID_ROPAS,ID_PARTENAIRE,ID_TAILLE,IMAGES_1,IMAGES_2,IMAGES_3,ID_USER
) => {
    try {
        var sqlQuery = "INSERT INTO restaurant_menu (ID_CATEGORIE_MENU,ID_SOUS_CATEGORIE_MENU,ID_SOUS_SOUS_CATEGORIE,ID_ROPAS,ID_PARTENAIRE,ID_TAILLE,IMAGES_1,IMAGES_2,IMAGES_3,	ID_USER)";
        sqlQuery += "values (?,?,?,?,?,?,?,?,?,?)";
        return query(sqlQuery, [ID_CATEGORIE_MENU,ID_SOUS_CATEGORIE_MENU,ID_SOUS_SOUS_CATEGORIE,ID_ROPAS,ID_PARTENAIRE,ID_TAILLE,IMAGES_1,IMAGES_2,IMAGES_3,	ID_USER])
    }
    catch (error) {

        throw error
    }
}


const findById = async (id) => {
    try {
      return query("SELECT * FROM  restaurant_menu WHERE ID_RESTAURANT_MENU=?", [id]);
} catch (error) {
      throw error;
    }
  };

module.exports = {
    createMenu,
    findById,

}