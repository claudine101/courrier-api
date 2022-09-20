const { query } = require("../utils/db");

const createProduit = (ID_PRODUIT,ID_PARTENAIRE,ID_CATEGORIE_PRODUIT,ID_PRODUIT_SOUS_CATEGORIE,ID_TAILLE,NOM,DESCRIPTION
) => {
    try {
        var sqlQuery = "INSERT INTO ecommerce_produit_partenaire (ID_PRODUIT,ID_PARTENAIRE,ID_CATEGORIE_PRODUIT,ID_PRODUIT_SOUS_CATEGORIE	,ID_TAILLE,NOM,DESCRIPTION)";
        sqlQuery += "values (?,?,?,?,?,?,?)";
        return query(sqlQuery, [ID_PRODUIT,ID_PARTENAIRE,ID_CATEGORIE_PRODUIT,ID_PRODUIT_SOUS_CATEGORIE,ID_TAILLE,NOM,DESCRIPTION])
    }
    catch (error) {

        throw error
    }
}
const createStock = (ID_PRODUIT_PARTENAIRE,QUANTITE_STOCKE,QUANTITE_RESTANTE,QUANTITE_VENDUE
     ) => {
    try {
        var sqlQuery = "INSERT INTO ecommerce_produit_stock (ID_PRODUIT_PARTENAIRE,QUANTITE_STOCKE,QUANTITE_RESTANTE,QUANTITE_VENDUE )";
        sqlQuery += "values (?,?,?,?)";
        return query(sqlQuery, ([ID_PRODUIT_PARTENAIRE,QUANTITE_STOCKE,QUANTITE_RESTANTE,QUANTITE_VENDUE ]))
    }
    catch (error) {

        throw error
    }
}
const createPrix = (ID_PRODUIT_STOCK,PRIX,ID_STATUT) => {
    try {
        var sqlQuery = "INSERT INTO  ecommerce_stock_prix (ID_PRODUIT_STOCK,PRIX,ID_STATUT)";
        sqlQuery += "values (?,?,?)";
        return query(sqlQuery, ([ID_PRODUIT_STOCK,PRIX,ID_STATUT]))
    }
    catch (error) {

        throw error
    }
    
}
const findById = async (id) => {
    try {
      return query("SELECT * FROM  ecommerce_produits pr LEFT JOIN ecommerce_produit_partenaire pro ON  pr.ID_PRODUIT=pr.ID_PRODUIT LEFT JOIN ecommerce_produit_stock st ON st.ID_PRODUIT_PARTENAIRE=pro.ID_PRODUIT_PARTENAIRE LEFT JOIN ecommerce_stock_prix pri ON pri.ID_PRODUIT_STOCK=st.ID_PRODUIT_STOCK WHERE pro.ID_PRODUIT_PARTENAIRE=?", [id]);
} catch (error) {
      throw error;
    }
  };
  const findByIdPartenaire = async (id) => {
    try {
      return query("SELECT * FROM   partenaires p LEFT JOIN  ecommerce_produit_partenaire par ON p.ID_PARTENAIRE=par.ID_PARTENAIRE LEFT JOIN ecommerce_produit_stock sto ON sto.ID_PRODUIT_PARTENAIRE =par.ID_PRODUIT_PARTENAIRE  WHERE p.ID_PARTENAIRE= ?", [id]);

    } catch (error) {
      throw error;
    }
  };
  const findByIdPoduit = async (userID,id) => {
    try {
      return query("SELECT * FROM  partenaires p LEFT JOIN ecommerce_produit_partenaire par ON par.ID_PARTENAIRE=p.ID_PARTENAIRE LEFT JOIN  ecommerce_produits pro ON pro.ID_PRODUIT=par.ID_PRODUIT LEFT JOIN ecommerce_produit_stock st ON st.ID_PRODUIT_PARTENAIRE=par.ID_PRODUIT_PARTENAIRE LEFT  JOIN ecommerce_historique_approvisionnement histo on histo.ID_PRODUIT_STOCK=st.ID_PRODUIT_STOCK LEFT JOIN ecommerce_historique_ecoulement ec on ec.ID_PRODUIT_STOCK=st.ID_PRODUIT_STOCK WHERE p.ID_USER=? AND pro.ID_PRODUIT=?", [userID,id]);

    } catch (error) {
      throw error;
    }
  };
module.exports = {
    createProduit,
    createStock,
    createPrix,
    findById,
    findByIdPartenaire,
    findByIdPoduit
}