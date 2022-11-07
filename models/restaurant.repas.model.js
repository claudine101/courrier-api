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
const findRepas = async (id) => {
  try {
            return query("SELECT * FROM  restaurant_repas WHERE 1 ");
  } catch (error) {
            throw error;
  }
};
module.exports = {
        createOne,
          findById,
          findRepas
}