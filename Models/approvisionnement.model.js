const { query } = require("../utils/db");

const createApprovisionne = ( ID_PRODUIT_STOCK,QUANTITE_INITIAL,QUANTITE_APPROVISIONNER,QUANTITE,) => {
    try {
        var sqlQuery = "INSERT INTO ecommerce_historique_approvisionnement (ID_PRODUIT_STOCK,QUANTITE_INITIAL,QUANTITE_APPROVISIONNER,QUANTITE)";
        sqlQuery += "values (?,?,?,?)";
        return query(sqlQuery, [ID_PRODUIT_STOCK,QUANTITE_INITIAL,QUANTITE_APPROVISIONNER,QUANTITE])
    }
    catch (error) {

        throw error
    }
}
const findById = async (id) => {
    try {
      return query("SELECT * FROM  ecommerce_produit_stock WHERE  ID_PRODUIT_STOCK=?", [id]);
} catch (error) {
      throw error;
    }
  };
  const update = async (QUANTITE_STOCKE,QUANTITE_RESTANTE,id) => {
    try {
      return query("UPDATE ecommerce_produit_stock SET QUANTITE_STOCKE=?, QUANTITE_RESTANTE=? ,QUANTITE_VENDUE=null WHERE ID_PRODUIT_STOCK=? ", [QUANTITE_STOCKE,QUANTITE_RESTANTE,id]);
} catch (error) {
      throw error;
    }
  };
  
  
module.exports = {
    createApprovisionne,
    findById,
    update
}