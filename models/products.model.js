const { query } = require("../utils/db");
const findproducts = async (wishlist,id,category, subCategory, limit = 10, offset = 0) => {
          try {
                    var binds = []
                    var sqlQuery = "SELECT ep.ID_PRODUIT, ep.NOM, ep.IMAGE, "
                    sqlQuery += " pp.ID_PRODUIT_PARTENAIRE, pp.NOM AS NOM_PRODUIT_PARTENAIRE,pp.DESCRIPTION,pp.IMAGE_1,pp.IMAGE_2, pp.IMAGE_3, "
                    sqlQuery += " pas.NOM_ORGANISATION, p.ID_PARTENAIRE, pas.ID_TYPE_PARTENAIRE, u.NOM NOM_USER, u.PRENOM, "
                    sqlQuery += " pc.ID_CATEGORIE_PRODUIT, pc.NOM AS NOM_CATEGORIE, psc.ID_PRODUIT_SOUS_CATEGORIE, psc.NOM AS NOM_SOUS_CATEGORIE,sp.PRIX, "
                    sqlQuery += " ps.ID_PRODUIT_STOCK, ps.QUANTITE_STOCKE, ps.QUANTITE_RESTANTE, ps.QUANTITE_VENDUE "
                    sqlQuery += "FROM ecommerce_produit_partenaire pp "
                    sqlQuery += " LEFT JOIN ecommerce_produits ep ON ep.ID_PRODUIT=pp.ID_PRODUIT "
                    sqlQuery += " LEFT JOIN partenaires p ON pp.ID_PARTENAIRE=p.ID_PARTENAIRE "
                    sqlQuery += " LEFT JOIN partenaire_service pas ON pas.ID_PARTENAIRE = p.ID_PARTENAIRE AND pas.ID_SERVICE = 1 "
                    sqlQuery += " LEFT JOIN users u ON u.ID_USER=p.ID_USER "
                    sqlQuery += " LEFT JOIN ecommerce_produit_categorie pc ON pc.ID_CATEGORIE_PRODUIT=pp.ID_CATEGORIE_PRODUIT "
                    sqlQuery += " LEFT JOIN ecommerce_produit_sous_categorie psc ON psc.ID_PRODUIT_SOUS_CATEGORIE=pp.ID_PRODUIT_SOUS_CATEGORIE "
                    sqlQuery += " LEFT JOIN ecommerce_produit_stock ps  ON ps.ID_PRODUIT_PARTENAIRE=pp.ID_PRODUIT_PARTENAIRE "
                    sqlQuery += " LEFT JOIN  ecommerce_stock_prix sp ON sp.ID_PRODUIT_STOCK=ps.ID_PRODUIT_STOCK "
                    sqlQuery += " WHERE 1 AND sp.ID_STATUT = 1 "
                    if(wishlist)
                    {
                        sqlQuery=" SELECT ep.ID_PRODUIT, ep.NOM, ep.IMAGE,  pp.ID_PRODUIT_PARTENAIRE, "
                        sqlQuery += " pp.NOM AS NOM_PRODUIT_PARTENAIRE,pp.DESCRIPTION,pp.IMAGE_1,"
                        sqlQuery += " pp.IMAGE_2, pp.IMAGE_3,  pas.NOM_ORGANISATION, p.ID_PARTENAIRE,"
                        sqlQuery += " pas.ID_TYPE_PARTENAIRE, u.NOM NOM_USER, u.PRENOM, "
                        sqlQuery += " pc.ID_CATEGORIE_PRODUIT, pc.NOM AS NOM_CATEGORIE, "
                        sqlQuery += " psc.ID_PRODUIT_SOUS_CATEGORIE, psc.NOM AS NOM_SOUS_CATEGORIE,"
                        sqlQuery += " sp.PRIX,  ps.ID_PRODUIT_STOCK, ps.QUANTITE_STOCKE, "
                        sqlQuery += " ps.QUANTITE_RESTANTE, ps.QUANTITE_VENDUE FROM  "
                        sqlQuery += " ecommerce_produit_partenaire pp  LEFT JOIN ecommerce_produits  "
                        sqlQuery += " ep ON ep.ID_PRODUIT=pp.ID_PRODUIT  LEFT JOIN partenaires "
                        sqlQuery += " p ON pp.ID_PARTENAIRE=p.ID_PARTENAIRE  LEFT JOIN  "
                        sqlQuery += " partenaire_service pas ON pas.ID_PARTENAIRE = p.ID_PARTENAIRE "
                        sqlQuery += " AND pas.ID_SERVICE = 1  LEFT JOIN users u ON u.ID_USER=p.ID_USER "
                        sqlQuery += " LEFT JOIN ecommerce_produit_categorie pc ON "
                        sqlQuery += " pc.ID_CATEGORIE_PRODUIT=pp.ID_CATEGORIE_PRODUIT  "
                        sqlQuery += " LEFT JOIN ecommerce_produit_sous_categorie psc "
                        sqlQuery += " ON psc.ID_PRODUIT_SOUS_CATEGORIE=pp.ID_PRODUIT_SOUS_CATEGORIE "
                        sqlQuery += " LEFT JOIN ecommerce_produit_stock ps  "
                        sqlQuery += " ON ps.ID_PRODUIT_PARTENAIRE=pp.ID_PRODUIT_PARTENAIRE "
                        sqlQuery += " LEFT JOIN  ecommerce_stock_prix sp ON  "
                        sqlQuery += " sp.ID_PRODUIT_STOCK=ps.ID_PRODUIT_STOCK   " 
                        sqlQuery += " LEFT JOIN ecommerce_wishlist_produit wi ON "
                        sqlQuery += " wi.ID_PRODUIT_PARTENAIRE=pp.ID_PRODUIT_PARTENAIRE "
                        sqlQuery += " WHERE 1 AND sp.ID_STATUT = 1  AND wi.ID_USERS=? "
                        binds.push(id)
                    }
                    if(category) {
                              sqlQuery += " AND pp.ID_CATEGORIE_PRODUIT = ? "
                              binds.push(category)
                    }
                    if(subCategory) {
                              sqlQuery += " AND pp.ID_PRODUIT_SOUS_CATEGORIE = ? "
                              binds.push(subCategory)
                    }
                    sqlQuery += ` ORDER BY pp.DATE_INSERTION DESC LIMIT ${offset}, ${limit}`;
                    return query(sqlQuery, [binds]);
          }
          catch (error) {
                    throw error

    }
}
const findone = async (ID_PRODUIT_PARTENAIRE) => {
    try {
        var binds = []
        var sqlQuery = "SELECT ep.ID_PRODUIT, ep.NOM, ep.IMAGE, "
        sqlQuery += " pp.ID_PRODUIT_PARTENAIRE, pp.NOM AS NOM_PRODUIT_PARTENAIRE,pp.DESCRIPTION,pp.IMAGE_1,pp.IMAGE_2, pp.IMAGE_3, "
        sqlQuery += " pas.NOM_ORGANISATION, pc.ID_CATEGORIE_PRODUIT, pc.NOM AS NOM_CATEGORIE, psc.ID_PRODUIT_SOUS_CATEGORIE, psc.NOM AS NOM_SOUS_CATEGORIE,sp.PRIX, "
        sqlQuery += " ps.ID_PRODUIT_STOCK, ps.QUANTITE_STOCKE, ps.QUANTITE_RESTANTE, ps.QUANTITE_VENDUE "
        sqlQuery += "FROM ecommerce_produit_partenaire pp "
        sqlQuery += " LEFT JOIN ecommerce_produits ep ON ep.ID_PRODUIT=pp.ID_PRODUIT "
        sqlQuery += " LEFT JOIN partenaires p ON pp.ID_PARTENAIRE=p.ID_PARTENAIRE "
        sqlQuery += " LEFT JOIN partenaire_service pas ON pas.ID_PARTENAIRE = p.ID_PARTENAIRE AND pas.ID_SERVICE = 1 "
        sqlQuery += " LEFT JOIN ecommerce_produit_categorie pc ON pc.ID_CATEGORIE_PRODUIT=pp.ID_CATEGORIE_PRODUIT "
        sqlQuery += " LEFT JOIN ecommerce_produit_sous_categorie psc ON psc.ID_PRODUIT_SOUS_CATEGORIE=pp.ID_PRODUIT_SOUS_CATEGORIE "
        sqlQuery += " LEFT JOIN ecommerce_produit_stock ps  ON ps.ID_PRODUIT_PARTENAIRE=pp.ID_PRODUIT_PARTENAIRE "
        sqlQuery += " LEFT JOIN  ecommerce_stock_prix sp ON sp.ID_PRODUIT_STOCK=ps.ID_PRODUIT_STOCK "
        sqlQuery += " LEFT JOIN ecommerce_statut_prix st ON st.ID_STATUT=sp.ID_STATUT "
        sqlQuery += " WHERE 1 AND pp.ID_PRODUIT_PARTENAIRE=?"
        return query(sqlQuery, [ID_PRODUIT_PARTENAIRE]);
    }
    catch (error) {
        throw error

    }
}
const findBYidPartenaire = async (ID_PRODUIT_PARTENAIRE) => {
    try {
        var binds = []
        var sqlQuery = "SELECT ep.ID_PRODUIT, ep.NOM, ep.IMAGE, "
        sqlQuery += " pp.ID_PRODUIT_PARTENAIRE, pp.NOM AS NOM_PRODUIT_PARTENAIRE,pp.DESCRIPTION,pp.IMAGE_1,pp.IMAGE_2, pp.IMAGE_3, "
        sqlQuery += " p.NOM_ORGANISATION, pc.ID_CATEGORIE_PRODUIT, pc.NOM AS NOM_CATEGORIE, psc.ID_PRODUIT_SOUS_CATEGORIE, psc.NOM AS NOM_SOUS_CATEGORIE,sp.PRIX, "
        sqlQuery += " ps.ID_PRODUIT_STOCK, ps.QUANTITE_STOCKE, ps.QUANTITE_RESTANTE, ps.QUANTITE_VENDUE "
        sqlQuery += "FROM ecommerce_produit_partenaire pp "
        sqlQuery += " LEFT JOIN ecommerce_produits ep ON ep.ID_PRODUIT=pp.ID_PRODUIT "
        sqlQuery += " LEFT JOIN partenaires p ON pp.ID_PARTENAIRE=p.ID_PARTENAIRE "
        sqlQuery += " LEFT JOIN ecommerce_produit_categorie pc ON pc.ID_CATEGORIE_PRODUIT=pp.ID_CATEGORIE_PRODUIT "
        sqlQuery += " LEFT JOIN ecommerce_produit_sous_categorie psc ON psc.ID_PRODUIT_SOUS_CATEGORIE=pp.ID_PRODUIT_SOUS_CATEGORIE "
        sqlQuery += " LEFT JOIN ecommerce_produit_stock ps  ON ps.ID_PRODUIT_PARTENAIRE=pp.ID_PRODUIT_PARTENAIRE "
        sqlQuery += " LEFT JOIN  ecommerce_stock_prix sp ON sp.ID_PRODUIT_STOCK=ps.ID_PRODUIT_STOCK "
        sqlQuery += " LEFT JOIN ecommerce_statut_prix st ON st.ID_STATUT=sp.ID_STATUT "
        sqlQuery += " WHERE 1 AND p.ID_PARTENAIRE=?"
        return query(sqlQuery, [ID_PRODUIT_PARTENAIRE]);
    }
    catch (error) {
        throw error

    }
}
// const findproductsby = async (ID_PARTENAIRE) => {
//     try {
        
//         var sqlQuery="SELECT epc.ID_CATEGORIE_PRODUIT,epc.NOM,epc.IMAGE FROM ecommerce_produit_partenaire epp LEFT JOIN partenaires p ON p.ID_PARTENAIRE=epp.ID_PARTENAIRE  LEFT JOIN ecommerce_produit_categorie epc ON epc.ID_CATEGORIE_PRODUIT=epp.ID_CATEGORIE_PRODUIT WHERE 1 AND epp.ID_PARTENAIRE=?GROUP BY epc.ID_CATEGORIE_PRODUIT "


//         return query(sqlQuery, [ID_PARTENAIRE]);
//     }
//     catch (error) {
//         throw error

//     }
// }

const findCategories = async () => {
    try {
        return query("SELECT * FROM ecommerce_produit_categorie WHERE 1");
    }
    catch (error) {
        throw error
    }
}
const findById = async (id) => {
    try {
        var sqlQuery ="SELECT * FROM ecommerce_produit_categorie  cat LEFT JOIN  ecommerce_produit_partenaire px ON px.ID_CATEGORIE_PRODUIT=cat.ID_CATEGORIE_PRODUIT  WHERE px.ID_PARTENAIRE=?";
        return query(sqlQuery, [id]);
   
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
const findSizes = async (ID_CATEGORIE_PRODUIT,ID_PRODUIT_SOUS_CATEGORIE) => {
    try {

        return query("SELECT pt.ID_TAILLE,pc.NOM AS NOM_CATEGORIE,pt.NOM AS TAILLE FROM ecommerce_produit_tailles pt LEFT JOIN ecommerce_produit_categorie pc ON pc.ID_CATEGORIE_PRODUIT= pt.ID_CATEGORIE_PRODUIT  WHERE 1 AND  pt.ID_CATEGORIE_PRODUIT =? AND pt.ID_PRODUIT_SOUS_CATEGORIE=?", [ID_CATEGORIE_PRODUIT,ID_PRODUIT_SOUS_CATEGORIE]);
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
    findSousCategories,
    findone,
    findById,
    findBYidPartenaire
    
}