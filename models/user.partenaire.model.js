const { query } = require("../utils/db");
const findBy = async (column, value) => {
  try {
    var sqlQuery = `SELECT * FROM users JOIN partenaires ON users.ID_USER=partenaires.ID_USER WHERE ${column} = ? `;
    return query(sqlQuery, [value]);
  }
  catch (error) {
    throw error;
  }
};
const createOne = (NOM, PRENOM, EMAIL, USERNAME, PASSWORD, ID_PROFIL, SEXE, DATE_NAISSANCE, COUNTRY_ID, ADRESSE, TELEPHONE_1, TELEPHONE_2, IMAGE) => {
          try {
                    var sqlQuery = "INSERT INTO users (NOM,PRENOM,EMAIL,USERNAME,PASSWORD,ID_PROFIL,SEXE,DATE_NAISSANCE,COUNTRY_ID,ADRESSE,TELEPHONE_1,TELEPHONE_2,IMAGE)";
                    sqlQuery += "values (?,?,?,?,?,?,?,?,?,?,?,?,?)";
                    return query(sqlQuery, [
                              NOM, PRENOM, EMAIL, USERNAME, PASSWORD, ID_PROFIL, SEXE, DATE_NAISSANCE, COUNTRY_ID, ADRESSE, TELEPHONE_1, TELEPHONE_2, IMAGE])
          }
          catch (error) {

                    throw error
          }
}
const findById = async (id) => {
          try {
                    return query("SELECT * FROM users WHERE ID_USER  = ?", [id]);
          } catch (error) {
                    throw error;
          }
};
const findpartenaire = async (category, subCategory, limit = 10, offset = 0) => {
  try {
    var binds = []
    var sqlQuery = "SELECT * FROM partenaires p LEFT JOIN  partenaires_types t "
    sqlQuery += " ON p.ID_TYPE_PARTENAIRE=t.ID_PARTENAIRE_TYPE "
    sqlQuery += "   LEFT JOIN partenaire_service s ON s.ID_PARTENAIRE=p.ID_PARTENAIRE "
    sqlQuery += "  LEFT JOIN services ser ON ser.ID_SERVICE=s.ID_SERVICE "
  //   sqlQuery += "LEFT JOIN ecommerce_produit_partenaire  pr ON pr.ID_PARTENAIRE=p.ID_PARTENAIRE "
  //  sqlQuery += " LEFT JOIN ecommerce_produit_categorie cat ON cat.ID_CATEGORIE_PRODUIT=pr.ID_CATEGORIE_PRODUIT "
    sqlQuery += " LEFT JOIN users u  ON u.ID_USER=p.ID_USER WHERE t.ID_PARTENAIRE_TYPE=2 AND s.ID_SERVICE=1 "
    if (category) {
      sqlQuery = " SELECT p.ID_PARTENAIRE,px.ID_CATEGORIE_PRODUIT,p.NOM_ORGANISATION  "
      sqlQuery += " FROM partenaires p LEFT JOIN ecommerce_produit_partenaire "
      sqlQuery += " px ON px.ID_PARTENAIRE = p.ID_PARTENAIRE WHERE pX.ID_CATEGORIE_PRODUIT=?  "
      binds.push(category)
    }
    if (subCategory) {
      sqlQuery = " SELECT p.ID_PARTENAIRE,px.ID_CATEGORIE_PRODUIT,p.NOM_ORGANISATION  "
      sqlQuery += " FROM partenaires p LEFT JOIN ecommerce_produit_partenaire "
      sqlQuery += " px ON px.ID_PARTENAIRE = p.ID_PARTENAIRE WHERE px.ID_PRODUIT_SOUS_CATEGORIE=?  "
      binds.push(subCategory)
    }
    sqlQuery += `LIMIT ${offset}, ${limit}`;
    return query(sqlQuery, binds);
  }
  catch (error) {
    throw error
  }
         
}
const findbycategorie = async (id) => {
          try {

                    var sqlQuery = "SELECT epc.NOM,COUNT(epc.ID_CATEGORIE_PRODUIT) NOMBRE_PRODUITS "
                    sqlQuery += " FROM `ecommerce_produit_partenaire` epp "
                    sqlQuery += " LEFT JOIN ecommerce_produit_categorie epc "
                    sqlQuery += " ON epc.ID_CATEGORIE_PRODUIT = epp.ID_CATEGORIE_PRODUIT "
                    sqlQuery += " WHERE ID_PARTENAIRE = ? GROUP BY epc.ID_CATEGORIE_PRODUIT "
                    sqlQuery += " ORDER BY NOMBRE_PRODUITS DESC LIMIT 2 "
                    return query(sqlQuery, [id]);
          }
          catch (error) {
                    throw error
          }
}
const findByIdPartenaire = async (id, category, subCategory, limit = 10, offset = 0) => {
          try {
                    var binds = [id]
                    var sqlQuery = "SELECT ep.ID_PRODUIT, ep.NOM, ep.IMAGE, "
                    sqlQuery += " pp.ID_PRODUIT_PARTENAIRE, pp.NOM AS NOM_PRODUIT_PARTENAIRE,pp.DESCRIPTION,pp.IMAGE_1,pp.IMAGE_2, pp.IMAGE_3, "
                    sqlQuery += " p.NOM_ORGANISATION, pc.ID_CATEGORIE_PRODUIT, pc.NOM AS NOM_CATEGORIE, psc.ID_PRODUIT_SOUS_CATEGORIE, psc.NOM AS NOM_SOUS_CATEGORIE, pt.NOM NOM_TAILLE,sp.PRIX, "
                    sqlQuery += " ps.QUANTITE_STOCKE, ps.QUANTITE_RESTANTE, ps.QUANTITE_VENDUE "
                    sqlQuery += "FROM ecommerce_produit_partenaire pp "
                    sqlQuery += " LEFT JOIN ecommerce_produits ep ON ep.ID_PRODUIT=pp.ID_PRODUIT "
                    sqlQuery += " LEFT JOIN partenaires p ON pp.ID_PARTENAIRE=p.ID_PARTENAIRE "
                    sqlQuery += " LEFT JOIN ecommerce_produit_categorie pc ON pc.ID_CATEGORIE_PRODUIT=pp.ID_CATEGORIE_PRODUIT "
                    sqlQuery += " LEFT JOIN ecommerce_produit_sous_categorie psc ON psc.ID_PRODUIT_SOUS_CATEGORIE=pp.ID_PRODUIT_SOUS_CATEGORIE "
                    sqlQuery += " LEFT JOIN ecommerce_produit_tailles pt ON pt.ID_TAILLE=pp.ID_TAILLE "
                    sqlQuery += " LEFT JOIN ecommerce_produit_stock ps  ON ps.ID_PRODUIT_PARTENAIRE=pp.ID_PRODUIT_PARTENAIRE "
                    sqlQuery += " LEFT JOIN  ecommerce_stock_prix sp ON sp.ID_PRODUIT_STOCK=ps.ID_PRODUIT_STOCK "
                    sqlQuery += " LEFT JOIN ecommerce_statut_prix st ON st.ID_STATUT=sp.ID_STATUT "
                    sqlQuery += " WHERE p.ID_PARTENAIRE= ?"
                    if (category) {
                              sqlQuery += " AND pp.ID_CATEGORIE_PRODUIT = ? "
                              binds.push(category)
                    }
                    if (subCategory) {
                              sqlQuery += " AND pp.ID_PRODUIT_SOUS_CATEGORIE = ? "
                              binds.push(subCategory)
                    }
                    sqlQuery += `LIMIT ${offset}, ${limit}`;
                    return query(sqlQuery, [binds]);

          } catch (error) {
                    throw error;
          }
};
const findcategories = async (ID_PARTENAIRE) => {
          try {
                    var sqlQuery = "SELECT epc.ID_CATEGORIE_PRODUIT,epc.NOM,epc.IMAGE FROM ecommerce_produit_partenaire epp LEFT JOIN partenaires p ON p.ID_PARTENAIRE=epp.ID_PARTENAIRE  LEFT JOIN ecommerce_produit_categorie epc ON epc.ID_CATEGORIE_PRODUIT=epp.ID_CATEGORIE_PRODUIT WHERE 1 AND epp.ID_PARTENAIRE=?GROUP BY epc.ID_CATEGORIE_PRODUIT "


                    return query(sqlQuery, [ID_PARTENAIRE]);

          } catch (error) {
                    throw error;
          }
};

module.exports = {
          findBy,
          createOne,
          findById,
          findpartenaire,
          findbycategorie,
          findByIdPartenaire,
          findcategories
}