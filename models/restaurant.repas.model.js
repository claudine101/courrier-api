const { query } = require("../utils/db");

const createOne = (ID_PARTENAIRE,ID_TYPE_REPAS,DESCRIPTION,DESCRIPTION_FOURNISSEUR
) => {
          try {
                    var sqlQuery = "INSERT INTO  restaurant_repas "
                    sqlQuery += "(ID_PARTENAIRE,ID_TYPE_REPAS,DESCRIPTION,DESCRIPTION_FOURNISSEUR)";
                    sqlQuery += "values (?,?,?,?)";
                    return query(sqlQuery, [ID_PARTENAIRE,ID_TYPE_REPAS,DESCRIPTION,DESCRIPTION_FOURNISSEUR])
          }
          catch (error) {

                    throw error
          }
}
const findById = async (id) => {
          try {
                    return query("SELECT * FROM  restaurant_repas WHERE ID_REPAS=?", [id]);
          } catch (error) {
                    throw error;
          }
};
const findRepas = async (q) => {
  // try {
  //           return query("SELECT * FROM  restaurant_repas WHERE 1 ");
  // }
  try {
    var binds = []
    var sqlQuery="SELECT * FROM  restaurant_repas WHERE 1 "
    // return query("SELECT * FROM ecommerce_produit_categorie WHERE 1");
    if (q && q != "") {
        sqlQuery +=" AND  NOM LIKE  ?"
        binds.push(
            `%${q}%`)
    }
    return query(sqlQuery, binds);
}
   catch (error) {
            throw error;
  }
};

module.exports = {
        createOne,
          findById,
          findRepas
}