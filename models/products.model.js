const { query } = require("../utils/db");
const findproducts = async (category, subCategory, limit = 10, offset = 0) => {
          try {
                    var binds = []
                    var sqlQuery = "SELECT ep.ID_PRODUIT, ep.NOM, ep.IMAGE, "
                    sqlQuery += " pp.ID_PRODUIT_PARTENAIRE, pp.NOM AS NOM_PRODUIT_PARTENAIRE,pp.DESCRIPTION,pp.IMAGE_1,pp.IMAGE_2, pp.IMAGE_3, "
                    sqlQuery += " p.NOM_ORGANISATION, p.ID_PARTENAIRE, p.ID_TYPE_PARTENAIRE, u.NOM NOM_USER, u.PRENOM, "
                    sqlQuery += " pc.ID_CATEGORIE_PRODUIT, pc.NOM AS NOM_CATEGORIE, psc.ID_PRODUIT_SOUS_CATEGORIE, psc.NOM AS NOM_SOUS_CATEGORIE, pt.NOM NOM_TAILLE,sp.PRIX, "
                    sqlQuery += " ps.QUANTITE_STOCKE, ps.QUANTITE_RESTANTE, ps.QUANTITE_VENDUE "
                    sqlQuery += "FROM ecommerce_produit_partenaire pp "
                    sqlQuery += " LEFT JOIN ecommerce_produits ep ON ep.ID_PRODUIT=pp.ID_PRODUIT "
                    sqlQuery += " LEFT JOIN partenaires p ON pp.ID_PARTENAIRE=p.ID_PARTENAIRE "
                    sqlQuery += " LEFT JOIN users u ON u.ID_USER=p.ID_USER "
                    sqlQuery += " LEFT JOIN ecommerce_produit_categorie pc ON pc.ID_CATEGORIE_PRODUIT=pp.ID_CATEGORIE_PRODUIT "
                    sqlQuery += " LEFT JOIN ecommerce_produit_sous_categorie psc ON psc.ID_PRODUIT_SOUS_CATEGORIE=pp.ID_PRODUIT_SOUS_CATEGORIE "
                    sqlQuery += " LEFT JOIN ecommerce_produit_tailles pt ON pt.ID_TAILLE=pp.ID_TAILLE "
                    sqlQuery += " LEFT JOIN ecommerce_produit_stock ps  ON ps.ID_PRODUIT_PARTENAIRE=pp.ID_PRODUIT_PARTENAIRE "
                    sqlQuery += " LEFT JOIN  ecommerce_stock_prix sp ON sp.ID_PRODUIT_STOCK=ps.ID_PRODUIT_STOCK "
                    sqlQuery += " WHERE 1 AND sp.ID_STATUT = 1 "
                    if(category) {
                              sqlQuery += " AND pp.ID_CATEGORIE_PRODUIT = ? "
                              binds.push(category)
                    }
                    if(subCategory) {
                              sqlQuery += " AND pp.ID_PRODUIT_SOUS_CATEGORIE = ? "
                              binds.push(subCategory)
                    }
                    sqlQuery += `LIMIT ${offset}, ${limit}`;
                    return query(sqlQuery, [category]);
          }
          catch (error) {
                    throw error

          }
}
const findCategories = async () => {
          try {
                    return query("SELECT * FROM ecommerce_produit_categorie WHERE 1");
          }
          catch (error) {
                    throw error
          }
}
const findSousCategories = async () => {
          try {

                    return query("SELECT * FROM `ecommerce_produit_sous_categorie` WHERE 1");
          }
          catch (error) {
                    throw error

          }
}

const findSousCategoriesBy = async (ID_CATEGORIE_PRODUIT) => {
          try {

                    return query("SELECT pc.NOM AS NOM_CATEGORIE,psc.ID_PRODUIT_SOUS_CATEGORIE,psc.NOM AS NOM_SOUS_CATEGORIE FROM ecommerce_produit_sous_categorie psc LEFT JOIN ecommerce_produit_categorie pc ON pc.ID_CATEGORIE_PRODUIT=psc.ID_CATEGORIE_PRODUIT  WHERE 1 AND psc.ID_CATEGORIE_PRODUIT=?", [ID_CATEGORIE_PRODUIT]);
          }
          catch (error) {
                    throw error

          }
}
const findSizes = async (ID_CATEGORIE_PRODUIT) => {
          try {

                    return query("SELECT pc.NOM AS NOM_CATEGORIE,pt.NOM AS TAILLE FROM ecommerce_produit_tailles pt LEFT JOIN ecommerce_produit_categorie pc ON pc.ID_CATEGORIE_PRODUIT= pt.ID_CATEGORIE_PRODUIT  WHERE 1 AND  pt.ID_CATEGORIE_PRODUIT =?", [ID_CATEGORIE_PRODUIT]);
          }
          catch (error) {
                    throw error

          }
}


module.exports = {
          findproducts,
          findCategories,
          findSousCategoriesBy,
          findSizes,
          findSousCategories
}