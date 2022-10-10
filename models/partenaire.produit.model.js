const { query } = require("../utils/db");

const createProduit = (ID_PRODUIT, ID_PARTENAIRE, ID_CATEGORIE_PRODUIT, ID_PRODUIT_SOUS_CATEGORIE, ID_TAILLE, NOM, DESCRIPTION, IMAGE_1, IMAGE_2, IMAGE_3
) => {
          try {
                    var sqlQuery = "INSERT INTO ecommerce_produit_partenaire (ID_PRODUIT,ID_PARTENAIRE,ID_CATEGORIE_PRODUIT,ID_PRODUIT_SOUS_CATEGORIE,ID_TAILLE,NOM,DESCRIPTION,IMAGE_1,IMAGE_2,IMAGE_3)";
                    sqlQuery += "values (?,?,?,?,?,?,?,?,?,?)";
                    return query(sqlQuery, [ID_PRODUIT, ID_PARTENAIRE, ID_CATEGORIE_PRODUIT, ID_PRODUIT_SOUS_CATEGORIE, ID_TAILLE, NOM, DESCRIPTION, IMAGE_1, IMAGE_2, IMAGE_3])
          }
          catch (error) {

                    throw error
          }
}
const createStock = (ID_PRODUIT_PARTENAIRE, QUANTITE_STOCKE, QUANTITE_RESTANTE, QUANTITE_VENDUE
) => {
          try {
                    var sqlQuery = "INSERT INTO ecommerce_produit_stock (ID_PRODUIT_PARTENAIRE,QUANTITE_STOCKE,QUANTITE_RESTANTE,QUANTITE_VENDUE )";
                    sqlQuery += "values (?,?,?,?)";
                    return query(sqlQuery, ([ID_PRODUIT_PARTENAIRE, QUANTITE_STOCKE, QUANTITE_RESTANTE, QUANTITE_VENDUE]))
          }
          catch (error) {

                    throw error
          }
}
const createPrix = (ID_PRODUIT_STOCK, PRIX) => {
          try {
                    var sqlQuery = "INSERT INTO  ecommerce_stock_prix (ID_PRODUIT_STOCK,PRIX,ID_STATUT)";
                    sqlQuery += "values (?,?,?)";
                    return query(sqlQuery, ([ID_PRODUIT_STOCK, PRIX, 1]))
          }
          catch (error) {

                    throw error
          }

}
const createDetails = (ID_PRODUIT_PARTENAIRE,ID_TAILLE,ID_COULEUR,QUANTITE) => {
    try {
              var sqlQuery = "INSERT INTO  ecommerce_produit_details (ID_PRODUIT_PARTENAIRE,ID_TAILLE,ID_COULEUR,QUANTITE)";
              sqlQuery += "values (?,?,?,?)";
              return query(sqlQuery, ([ID_PRODUIT_PARTENAIRE,ID_TAILLE,ID_COULEUR,QUANTITE]))
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

const findByIdPartenaire = async (idPartenaire, category, subCategory, limit = 10, offset = 0) => {
          try {
                    var binds = [idPartenaire]
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
                    sqlQuery += " WHERE pp.ID_PARTENAIRE = ? AND sp.ID_STATUT = 1 "
                    if(category) {
                              sqlQuery += " AND pp.ID_CATEGORIE_PRODUIT = ? "
                              binds.push(category)
                    }
                    if(subCategory) {
                              sqlQuery += " AND pp.ID_PRODUIT_SOUS_CATEGORIE = ? "
                              binds.push(subCategory)
                    }
                    sqlQuery += " ORDER BY pp.DATE_INSERTION DESC "
                    sqlQuery += `LIMIT ${offset}, ${limit}`;
                    return query(sqlQuery, binds);
          }
          catch (error) {
                    throw error
          }

    }
const findByIdPoduit = async (userID, id) => {
          try {
                    return query("SELECT * FROM  partenaires p LEFT JOIN ecommerce_produit_partenaire par ON par.ID_PARTENAIRE=p.ID_PARTENAIRE LEFT JOIN  ecommerce_produits pro ON pro.ID_PRODUIT=par.ID_PRODUIT LEFT JOIN ecommerce_produit_stock st ON st.ID_PRODUIT_PARTENAIRE=par.ID_PRODUIT_PARTENAIRE LEFT  JOIN ecommerce_historique_approvisionnement histo on histo.ID_PRODUIT_STOCK=st.ID_PRODUIT_STOCK LEFT JOIN ecommerce_historique_ecoulement ec on ec.ID_PRODUIT_STOCK=st.ID_PRODUIT_STOCK WHERE p.ID_USER=? AND pro.ID_PRODUIT=?", [userID, id]);

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
          findByIdPoduit,
          createDetails
}