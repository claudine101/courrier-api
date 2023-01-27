const { query } = require("../utils/db");

const findproduct = async (id, category, subCategory, limit = 10, offset = 0) => {
  try {

    var binds = []
    var sqlQuery = " SELECT ep.ID_PRODUIT,ep.NOM,ep.IMAGE_1,ep.IMAGE_2,ep.IMAGE_3,ps.NOM_ORGANISATION, "
    sqlQuery += " ps.ID_TYPE_PARTENAIRE,ps.ID_PARTENAIRE,u.NOM AS NOM_USER, u.PRENOM,ps.ID_PARTENAIRE_SERVICE, "
    sqlQuery += " epp.ID_PRODUIT_PARTENAIRE,epp.DESCRIPTION , eps.ID_PRODUIT_STOCK,eps.QUANTITE_TOTAL,"
    sqlQuery += " eps.QUANTITE_VENDUS,eps.QUANTITE_RESTANTE ,ept.TAILLE,ep.ID_CATEGORIE_PRODUIT,ep.ID_PRODUIT_SOUS_CATEGORIE "
    sqlQuery += " FROM ecommerce_produits ep "
    sqlQuery += " LEFT JOIN partenaire_service ps ON ps.ID_PARTENAIRE_SERVICE=ep.ID_PARTENAIRE_SERVICE  "
    sqlQuery += " LEFT JOIN  partenaires par ON par.ID_PARTENAIRE=ps.ID_PARTENAIRE "
    sqlQuery += " LEFT JOIN users u ON u.ID_USER=par.ID_USER "
    sqlQuery += " LEFT JOIN ecommerce_produit_partenaire epp ON epp.ID_PRODUIT=ep.ID_PRODUIT  "
    sqlQuery += "  LEFT JOIN ecommerce_produit_stock eps ON eps.ID_PRODUIT_PARTENAIRE=epp.ID_PRODUIT_PARTENAIRE "
    sqlQuery += " LEFT JOIN ecommerce_produit_tailles ept  ON ept.ID_TAILLE=eps.ID_PRODUIT_PARTENAIRE   "

    sqlQuery += " LEFT JOIN ecommerce_wishlist_produit wi ON "
    sqlQuery += " wi.ID_PRODUIT_PARTENAIRE=epp.ID_PRODUIT_PARTENAIRE "
    sqlQuery += " WHERE 1  AND wi.ID_USERS=? "
    // sqlQuery += " WHERE par.IS_VALIDE=1 AND eps.QUANTITE_RESTANTE>0 AND ps.ID_SERVICE=1 "

    binds.push(id)

    if (category) {
      sqlQuery += " AND eps.ID_CATEGORIE_PRODUIT = ? "
      binds.push(category)
    }
    if (subCategory) {
      sqlQuery += " AND eps.ID_PRODUIT_SOUS_CATEGORIE = ? "
      binds.push(subCategory)
    }
    sqlQuery += ` ORDER BY eps.DATE_INSERTION DESC LIMIT ${offset}, ${limit}`;
    return query(sqlQuery, [binds]);
  }
  catch (error) {
    throw error

  }
}

const findproducts = async (q, category, subCategory, partenaireService, min_prix, max_prix, limit = 10, offset = 0) => {

  try {
    var binds = []
    var sqlQuery = `
                    SELECT ep.*,
                              ps.NOM_ORGANISATION,
                              ps.ID_TYPE_PARTENAIRE,
                              ps.ID_PARTENAIRE,
                              ps.ID_PARTENAIRE_SERVICE,
                              ps.ADRESSE_COMPLETE,
                              epc.NOM NOM_CATEGORIE
                    FROM ecommerce_produits ep
                              LEFT JOIN partenaire_service ps ON ps.ID_PARTENAIRE_SERVICE = ep.ID_PARTENAIRE_SERVICE
                              LEFT JOIN partenaires par ON par.ID_PARTENAIRE = ps.ID_PARTENAIRE
                              LEFT JOIN ecommerce_produit_categorie epc ON epc.ID_CATEGORIE_PRODUIT = ep.ID_CATEGORIE_PRODUIT
                    WHERE 1
                    `
    if (q && q != "") {
      sqlQuery +=
        "AND  ep.NOM  LIKE ?";
      binds.push(`%${q}%`);
    }
    if (category) {
      sqlQuery += " AND ep.ID_CATEGORIE_PRODUIT=? "
      binds.push(category)
    }
    if (subCategory) {
      sqlQuery += " AND ep.ID_PRODUIT_SOUS_CATEGORIE = ? "
      binds.push(subCategory)
    }
    if (partenaireService) {
      sqlQuery += " AND ep.ID_PARTENAIRE_SERVICE = ? "
      binds.push(partenaireService)
    }
    if (min_prix && !max_prix) {
      sqlQuery += " AND ep.PRIX >= ? "
      binds.push(min_prix)
    } else if (!min_prix && max_prix) {
      sqlQuery += " AND ep.PRIX <= ? "
      binds.push(max_prix)

    } else if (min_prix && max_prix) {

      sqlQuery += " AND ep.PRIX BETWEEN min_prix=? AND max_prix=?"
      binds.push(min_prix && max_prix)

    }
    // if (prix1 && prix2) {

    //   sqlQuery += " AND ep.PRIX BETWEEN prix1=? AND prix2=?"
    //   binds.push(prix1, prix2)
    // }
    sqlQuery += ` ORDER BY ep.DATE_INSERTION DESC LIMIT ${offset}, ${limit}`;
    return query(sqlQuery, binds);
  }
  catch (error) {
    throw error

  }
}

const findproductCommande = async (q, category, subCategory, limit = 10, offset = 0) => {

  try {

    var binds = []
    var sqlQuery = `SELECT COUNT(ec.ID_PRODUIT_PARTENAIRE) AS nbre,
        ep.ID_PRODUIT,
        ep.NOM,
        ep.IMAGE_1,
        ep.IMAGE_2,
        ep.IMAGE_3,
        ps.NOM_ORGANISATION,
        ps.ID_TYPE_PARTENAIRE,
        ps.ID_PARTENAIRE,
        u.NOM AS NOM_USER,
        u.PRENOM,
        ps.ID_PARTENAIRE_SERVICE,
        epp.ID_PRODUIT_PARTENAIRE,
        epp.DESCRIPTION,
        eps.ID_PRODUIT_STOCK,
        eps.QUANTITE_TOTAL,
        eps.QUANTITE_VENDUS,
        eps.QUANTITE_RESTANTE,
        ep.ID_CATEGORIE_PRODUIT,
        ep.ID_PRODUIT_SOUS_CATEGORIE
    FROM ecommerce_produits ep
        LEFT JOIN partenaire_service ps ON ps.ID_PARTENAIRE_SERVICE = ep.ID_PARTENAIRE_SERVICE
        LEFT JOIN partenaires par ON par.ID_PARTENAIRE = ps.ID_PARTENAIRE
        LEFT JOIN users u ON u.ID_USER = par.ID_USER
        LEFT JOIN ecommerce_produit_partenaire epp ON epp.ID_PRODUIT = ep.ID_PRODUIT
        LEFT JOIN ecommerce_produit_stock eps ON eps.ID_PRODUIT_PARTENAIRE = epp.ID_PRODUIT_PARTENAIRE
        LEFT JOIN ecommerce_commandes ec ON ec.ID_PRODUIT_PARTENAIRE = epp.ID_PRODUIT_PARTENAIRE
    WHERE ps.ID_SERVICE = 1
        AND epp.ID_PRODUIT_PARTENAIRE IN (
            SELECT ec.ID_PRODUIT_PARTENAIRE
            FROM ecommerce_commandes
        )
    GROUP BY epp.ID_PRODUIT_PARTENAIRE
   `
    if (q && q != "") {
      sqlQuery +=
        "AND  ep.NOM  LIKE ?";
      binds.push(`%${q}%`);
    }
    if (category) {
      sqlQuery += " AND ep.ID_CATEGORIE_PRODUIT=? "
      binds.push(category)
    }
    if (subCategory) {
      sqlQuery += " AND ep.ID_PRODUIT_SOUS_CATEGORIE = ? "
      binds.push(subCategory)
    }

    sqlQuery += ` ORDER BY nbre DESC LIMIT ${offset}, ${limit}`;
    return query(sqlQuery, binds);

  }
  catch (error) {
    throw error

  }
}
const findproductByID = async (ID_PRODUIT_PARTENAIRE) => {

  try {

    var binds = []
    var sqlQuery = " SELECT ep.ID_PRODUIT,ep.NOM,ep.IMAGE_1,ep.IMAGE_2,ep.IMAGE_3,ps.NOM_ORGANISATION, "
    sqlQuery += " ps.ID_TYPE_PARTENAIRE,ps.ID_PARTENAIRE,u.NOM AS NOM_USER, u.PRENOM,ps.ID_PARTENAIRE_SERVICE, "
    sqlQuery += " epp.ID_PRODUIT_PARTENAIRE,epp.DESCRIPTION , eps.ID_PRODUIT_STOCK,eps.QUANTITE_TOTAL,"
    sqlQuery += " eps.QUANTITE_VENDUS,eps.QUANTITE_RESTANTE ,ep.ID_CATEGORIE_PRODUIT,ep.ID_PRODUIT_SOUS_CATEGORIE "
    sqlQuery += " FROM ecommerce_produits ep "
    sqlQuery += " LEFT JOIN partenaire_service ps ON ps.ID_PARTENAIRE_SERVICE=ep.ID_PARTENAIRE_SERVICE  "
    sqlQuery += " LEFT JOIN  partenaires par ON par.ID_PARTENAIRE=ps.ID_PARTENAIRE "
    sqlQuery += " LEFT JOIN users u ON u.ID_USER=par.ID_USER "
    sqlQuery += " LEFT JOIN ecommerce_produit_partenaire epp ON epp.ID_PRODUIT=ep.ID_PRODUIT  "
    sqlQuery += "  LEFT JOIN ecommerce_produit_stock eps ON eps.ID_PRODUIT_PARTENAIRE=epp.ID_PRODUIT_PARTENAIRE "
    sqlQuery += " WHERE   ps.ID_SERVICE=1  AND epp.ID_PRODUIT_PARTENAIRE=?"
    return query(sqlQuery, ID_PRODUIT_PARTENAIRE);

  }
  catch (error) {
    throw error

  }
}
const findproductsResearch = async (q, category, subCategory, limit = 10, offset = 0) => {

  try {

    var binds = []

    var sqlQuery = " SELECT ep.ID_PRODUIT,ep.NOM,ep.IMAGE_1,ep.IMAGE_2,ep.IMAGE_3,ps.NOM_ORGANISATION, "
    sqlQuery += " ps.ID_TYPE_PARTENAIRE,ps.ID_PARTENAIRE,u.NOM AS NOM_USER, u.PRENOM,ps.ID_PARTENAIRE_SERVICE, "
    sqlQuery += " epp.ID_PRODUIT_PARTENAIRE,epp.DESCRIPTION , eps.ID_PRODUIT_STOCK,eps.QUANTITE_TOTAL,"
    sqlQuery += " eps.QUANTITE_VENDUS,eps.QUANTITE_RESTANTE ,ep.ID_CATEGORIE_PRODUIT,ep.ID_PRODUIT_SOUS_CATEGORIE "
    sqlQuery += " FROM ecommerce_produits ep "
    sqlQuery += " LEFT JOIN partenaire_service ps ON ps.ID_PARTENAIRE_SERVICE=ep.ID_PARTENAIRE_SERVICE  "
    sqlQuery += " LEFT JOIN  partenaires par ON par.ID_PARTENAIRE=ps.ID_PARTENAIRE "
    sqlQuery += " LEFT JOIN users u ON u.ID_USER=par.ID_USER "
    sqlQuery += " LEFT JOIN ecommerce_produit_partenaire epp ON epp.ID_PRODUIT=ep.ID_PRODUIT  "
    sqlQuery += "  LEFT JOIN ecommerce_produit_stock eps ON eps.ID_PRODUIT_PARTENAIRE=epp.ID_PRODUIT_PARTENAIRE "
    sqlQuery += " WHERE 1 AND   ps.ID_SERVICE=1 "
    if (q && q != "") {
      sqlQuery += "  AND ep.NOM LIKE ? "
      binds.push(`%${q}%`)
    }
    if (category) {
      sqlQuery += " AND ep.ID_CATEGORIE_PRODUIT=? "
      binds.push(category)
    }
    if (subCategory) {
      sqlQuery += " AND ep.ID_PRODUIT_SOUS_CATEGORIE = ? "
      binds.push(subCategory)
    }
    sqlQuery += ` ORDER BY eps.DATE_INSERTION DESC LIMIT ${offset}, ${limit}`;
    return query(sqlQuery, binds);

  }
  catch (error) {
    throw error

  }
}
const updateOne = async (NOTE, COMMENTAIRE, ID_NOTE) => {
  try {
    var sql = "UPDATE `ecommerce_produit_notes` SET NOTE=?,COMMENTAIRE=? WHERE ID_NOTE=?"
    return query(sql, [NOTE, COMMENTAIRE, ID_NOTE])
  }
  catch (error) {
    throw error
  }

}
const findone = async (ID_PRODUIT, limit = 10, offset = 0) => {

  try {
    var binds = []
    var sqlQuery = "SELECT ep.ID_PRODUIT,ep.NOM ,epc.NOM AS NOM_CATEGORIE,ep.IMAGE_1,ep.IMAGE_2,ep.IMAGE_3,ep.ID_PARTENAIRE_SERVICE,ps.NOM_ORGANISATION,u.NOM AS NOM_USER ,u.PRENOM,epc.NOM AS NOM_CATEGORIE,epc.IMAGE,"
    sqlQuery += " NOM_SOUS_CATEGORIE,eps.QUANTITE_TOTAL,sp.PRIX,ept.TAILLE,eps.QUANTITE_VENDUS,eps.QUANTITE_RESTANTE,ps.ID_TYPE_PARTENAIRE"
    sqlQuery += " FROM  ecommerce_produits ep LEFT JOIN ecommerce_produit_stock eps ON eps.ID_PRODUIT=ep.ID_PRODUIT"
    sqlQuery += " LEFT JOIN ecommerce_produit_details epd ON epd.ID_PRODUIT_STOCK =eps.ID_PRODUIT_STOCK LEFT JOIN"
    sqlQuery += " partenaire_service ps ON ps.ID_PARTENAIRE_SERVICE= ep.ID_PARTENAIRE_SERVICE LEFT JOIN"
    sqlQuery += " ecommerce_produit_categorie epc ON epc.ID_CATEGORIE_PRODUIT=ep.ID_CATEGORIE_PRODUIT"
    sqlQuery += " LEFT JOIN ecommerce_produit_sous_categorie epsc ON epc.ID_CATEGORIE_PRODUIT=epsc.ID_CATEGORIE_PRODUIT"
    sqlQuery += " LEFT JOIN  ecommerce_stock_prix sp ON sp.ID_PRODUIT_STOCK=eps.ID_PRODUIT_STOCK "
    sqlQuery += " LEFT JOIN ecommerce_statut_prix st ON st.ID_STATUT=sp.ID_STATUT"
    sqlQuery += " LEFT JOIN ecommerce_produit_tailles ept ON ept.ID_TAILLE=eps.ID_TAILLE"
    sqlQuery += " LEFT JOIN partenaires p ON p.ID_PARTENAIRE=ps.ID_PARTENAIRE LEFT JOIN users u ON u.ID_USER=p.ID_USER WHERE 1"
    sqlQuery += " AND ep.ID_PRODUIT=? "
    sqlQuery += ` ORDER BY eps.DATE_INSERTION DESC LIMIT ${offset}, ${limit}`;
    return query(sqlQuery, [ID_PRODUIT]);
  }

  catch (error) {
    throw error

  }
}
const findBYidPartenaire = async (ID_PARTENAIRE_SERVICE, limit = 10, offset = 0) => {
  try {
    var binds = [ID_PARTENAIRE_SERVICE]
    var sqlQuery = " SELECT ep.ID_PRODUIT,ep.NOM,ep.IMAGE_1,ep.IMAGE_2,ep.IMAGE_3,ps.NOM_ORGANISATION,COUNT(ep.ID_PARTENAIRE_SERVICE) AS NBRE_PRODUITS, "
    sqlQuery += " ps.ID_TYPE_PARTENAIRE,ps.ID_PARTENAIRE,u.NOM AS NOM_USER, u.PRENOM,ps.ID_PARTENAIRE_SERVICE, "
    sqlQuery += " epp.ID_PRODUIT_PARTENAIRE,epp.DESCRIPTION , eps.ID_PRODUIT_STOCK,eps.QUANTITE_TOTAL,"
    sqlQuery += " eps.QUANTITE_VENDUS,eps.QUANTITE_RESTANTE ,ep.ID_CATEGORIE_PRODUIT,ep.ID_PRODUIT_SOUS_CATEGORIE "
    sqlQuery += " FROM ecommerce_produits ep "
    sqlQuery += " LEFT JOIN partenaire_service ps ON ps.ID_PARTENAIRE_SERVICE=ep.ID_PARTENAIRE_SERVICE  "
    sqlQuery += " LEFT JOIN  partenaires par ON par.ID_PARTENAIRE=ps.ID_PARTENAIRE "
    sqlQuery += " LEFT JOIN users u ON u.ID_USER=par.ID_USER "
    sqlQuery += " LEFT JOIN ecommerce_produit_partenaire epp ON epp.ID_PRODUIT=ep.ID_PRODUIT  "
    sqlQuery += "  LEFT JOIN ecommerce_produit_stock eps ON eps.ID_PRODUIT_PARTENAIRE=epp.ID_PRODUIT_PARTENAIRE "
    sqlQuery += " WHERE   ps.ID_SERVICE=1 GROUP BY ep.ID_PARTENAIRE_SERVICE AND ps.ID_PARTENAIRE_SERVICE= ? "
    sqlQuery += ` ORDER BY eps.DATE_INSERTION DESC LIMIT ${offset}, ${limit}`;
    return query(sqlQuery, binds);

  }
  catch (error) {
    throw error

  }
}
const createNotes = (ID_USER, ID_PRODUIT, NOTE, COMMENTAIRE) => {
  try {
    var sqlQuery = "INSERT INTO ecommerce_produit_notes (ID_USER,ID_PRODUIT,NOTE,COMMENTAIRE)";
    sqlQuery += "values (?,?,?,?)";
    return query(sqlQuery, [
      ID_USER, ID_PRODUIT, NOTE, COMMENTAIRE])
  }
  catch (error) {

    throw error
  }
}

const findCategories = async (q) => {
  try {
    var binds = []
    var sqlQuery = "SELECT * FROM ecommerce_produit_categorie WHERE 1 "
    // return query("SELECT * FROM ecommerce_produit_categorie WHERE 1");
    if (q && q != "") {
      sqlQuery += " AND LIKE  NOM ?"
      binds.push(
        `%${q}%`)
    }
    return query(sqlQuery, binds);
  }
  catch (error) {
    throw error
  }
}
const findCategoriesPartnaire = async (ID_PARTENAIRE_SERVICE) => {
  try {
    var sqlQuery = "SELECT  DISTINCT epc.ID_CATEGORIE_PRODUIT,epc.NOM,epc.IMAGE  "
    sqlQuery += "FROM ecommerce_produit_categorie  epc LEFT  JOIN ecommerce_produits "
    sqlQuery += "ep ON ep.ID_CATEGORIE_PRODUIT=epc.ID_CATEGORIE_PRODUIT "
    sqlQuery += "LEFT JOIN ecommerce_produit_partenaire epp ON epp.ID_PRODUIT=ep.ID_PRODUIT "
    sqlQuery += "WHERE epp.ID_PARTENAIRE_SERVICE=?"
    return query(sqlQuery, [ID_PARTENAIRE_SERVICE]);

  }
  catch (error) {
    throw error
  }
}
const getdetail = async (ID_PRODUIT_PARTENAIRE) => {
  try {
    var sqlQuery = "SELECT ept.TAILLE, epd.QUANTITE_VENDUS,epd.QUANTITE_TOTAL,epd.QUANTITE_RESTANTE"
    sqlQuery += " FROM ecommerce_produit_details epd LEFT JOIN ecommerce_produit_stock eps ON "
    sqlQuery += " epd.ID_PRODUIT_STOCK=eps.ID_PRODUIT_STOCK "
    sqlQuery += " LEFT JOIN ecommerce_produit_tailles ept ON ept.ID_TAILLE=epd.ID_TAILLE"
    sqlQuery + " WHERE eps.ID_PRODUIT_PARTENAIRE=?"
    return query(sqlQuery, [ID_PRODUIT_PARTENAIRE]);
  }
  catch (error) {
    throw error
  }
}

const findById = async (id) => {
  try {
    var sqlQuery = "SELECT epn.ID_NOTE,epn.ID_NOTE,epn.NOTE,epn.COMMENTAIRE,epn.ID_PRODUIT,u.NOM,u.PRENOM, epn.ID_USER,epn.DATE_INSERTION,u.IMAGE FROM ecommerce_produit_notes epn LEFT JOIN users u ON epn.ID_USER=u.ID_USER   WHERE epn.ID_NOTE=?";
    return query(sqlQuery, [id]);

  }
  catch (error) {
    throw error
  }
}

const findByIdNote = async (id) => {
  try {
    return query("SELECT * FROM `ecommerce_produit_notes` WHERE ID_NOTE=?", [id]);
  } catch (error) {
    throw error;
  }
};

const findBYidProduitPartenaire = async (id, limit = 10, offset = 0) => {
  try {
    var sqlQuery = "SELECT epn.NOTE,epn.COMMENTAIRE,epn.ID_PRODUIT,u.NOM,u.PRENOM,"
    sqlQuery += " epn.ID_USER,epn.DATE_INSERTION,u.IMAGE FROM ecommerce_produit_notes epn LEFT JOIN"
    sqlQuery += " users u ON epn.ID_USER=u.ID_USER   WHERE epn.ID_PRODUIT=?"
    sqlQuery += ` ORDER BY epn.DATE_INSERTION DESC LIMIT ${offset}, ${limit}`;
    return query(sqlQuery, [id]);

  }
  catch (error) {
    throw error
  }
}
const findnoteProduitPartenaire = async (ID_PRODUIT) => {
  try {
    var sqlQuery = "SELECT epn.NOTE,epn.COMMENTAIRE,epn.ID_PRODUIT,u.NOM,u.PRENOM, u.NOM, u.PRENOM,"
    sqlQuery += " epn.ID_USER,epn.DATE_INSERTION,u.IMAGE FROM ecommerce_produit_notes epn LEFT JOIN"
    sqlQuery += " users u ON epn.ID_USER=u.ID_USER  WHERE epn.ID_PRODUIT=? "
    sqlQuery += ` ORDER BY epn.DATE_INSERTION DESC`;
    return query(sqlQuery, [ID_PRODUIT]);

  }
  catch (error) {
    throw error
  }
}
const findNoteUser = async (id) => {
  try {
    var sqlQuery = "SELECT epn.NOTE,epn.ID_NOTE,epn.COMMENTAIRE,epn.ID_PRODUIT,u.NOM,u.PRENOM,"
    sqlQuery += " epn.ID_USER,epn.DATE_INSERTION,u.IMAGE FROM ecommerce_produit_notes epn LEFT JOIN"
    sqlQuery += " users u ON epn.ID_USER=u.ID_USER   WHERE epn.ID_USER=?"
    sqlQuery += ` ORDER BY epn.DATE_INSERTION DESC`;
    return query(sqlQuery, [id]);

  }
  catch (error) {
    throw error
  }
}





const getPrix = async (id) => {
  try {
    var sqlQuery = "SELECT esp.PRIX   FROM ecommerce_produit_stock eps LEFT JOIN ecommerce_stock_prix esp ON eps.ID_PRODUIT_STOCK=esp.ID_PRODUIT_STOCK LEFT join ecommerce_statut_prix espr ON espr.ID_STATUT=esp.ID_STATUT WHERE espr.ID_STATUT=1  AND eps.ID_PRODUIT_PARTENAIRE=?";
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
const findSizes = async (ID_CATEGORIE_PRODUIT, ID_PRODUIT_SOUS_CATEGORIE) => {
  try {

    return query("SELECT pt.ID_TAILLE,pc.NOM AS NOM_CATEGORIE,pt.NOM AS TAILLE FROM ecommerce_produit_tailles pt LEFT JOIN ecommerce_produit_categorie pc ON pc.ID_CATEGORIE_PRODUIT= pt.ID_CATEGORIE_PRODUIT  WHERE 1 AND  pt.ID_CATEGORIE_PRODUIT =? AND pt.ID_PRODUIT_SOUS_CATEGORIE=?", [ID_CATEGORIE_PRODUIT, ID_PRODUIT_SOUS_CATEGORIE]);
  }
  catch (error) {
    throw error

  }
}
const findSize = async (ID_PRODUIT_PARTENAIRE) => {
  try {
    var binds = [ID_PRODUIT_PARTENAIRE]
    var sqlQuery = " SELECT DISTINCT(ept.ID_TAILLE) as id,ept.TAILLE as name  FROM   ecommerce_produit_stock eps "
    sqlQuery += " LEFT JOIN ecommerce_produit_details epd ON epd.ID_PRODUIT_STOCK=eps.ID_PRODUIT_STOCK "
    sqlQuery += " LEFT JOIN ecommerce_produit_tailles ept ON ept.ID_TAILLE=epd.ID_TAILLE WHERE ept.TAILLE!='' AND eps.ID_PRODUIT_PARTENAIRE=?  order by ept.ID_TAILLE DESC"
    return query(sqlQuery, binds);

  }
  catch (error) {
    throw error

  }
}
const findColor = async (ID_PRODUIT_PARTENAIRE, ID_TAILLE) => {
  try {
    var binds = [ID_PRODUIT_PARTENAIRE, ID_TAILLE]
    var sqlQuery = " SELECT epc.ID_COULEUR,epc.COULEUR  ,epd.QUANTITE_RESTANTE FROM   ecommerce_produit_stock eps  "
    sqlQuery += " LEFT JOIN ecommerce_produit_details epd ON epd.ID_PRODUIT_STOCK=eps.ID_PRODUIT_STOCK "
    sqlQuery += " LEFT JOIN ecommerce_produit_tailles ept ON ept.ID_TAILLE=epd.ID_TAILLE "
    sqlQuery += " LEFT JOIN ecommerce_produit_couleur  epc ON epc.ID_COULEUR=epd.ID_COULEUR "
    sqlQuery += " WHERE eps.ID_PRODUIT_PARTENAIRE=? AND epd.ID_TAILLE=? order by epc.ID_COULEUR DESC "

    return query(sqlQuery, binds);

  }
  catch (error) {
    throw error

  }
}
const findQte = async (ID_STOCK, ID_TAILLE, ID_COULEUR) => {
  try {
    var binds = [ID_STOCK, ID_TAILLE, ID_COULEUR]
    var sqlQuery = " SELECT epc.ID_COULEUR as id,epc.COULEUR as name,epd.QUANTITE_RESTANTE, eps.*,epd.*, ept.*  FROM   ecommerce_produit_stock eps  "
    sqlQuery += " LEFT JOIN ecommerce_produit_details epd ON epd.ID_PRODUIT_STOCK=eps.ID_PRODUIT_STOCK "
    sqlQuery += " LEFT JOIN ecommerce_produit_tailles ept ON ept.ID_TAILLE=epd.ID_TAILLE "
    sqlQuery += " LEFT JOIN ecommerce_produit_couleur  epc ON epc.ID_COULEUR=epd.ID_COULEUR "
    sqlQuery += " WHERE epd.ID_PRODUIT_STOCK=? AND epd.ID_TAILLE=?  AND epd.ID_COULEUR=?  "

    return query(sqlQuery, binds);

  }
  catch (error) {
    throw error

  }
}
const updateImage = async (IMAGES, index, ID_PRODUIT) => {
  try {
    var sqlQuery = `UPDATE  ecommerce_produits SET IMAGE_${parseInt(index) + 1} = ? WHERE ID_PRODUIT = ?`;
    return query(sqlQuery, [
      IMAGES,
      ID_PRODUIT
    ]);
  } catch (error) {
    throw error;
  }
}

const findByServiceProduits = async (ID_PARTENAIRE_SERVICE) => {
  try {
    var binds = [ID_PARTENAIRE_SERVICE]
    var sqlQuery = " SELECT ep.ID_PRODUIT, COUNT(ep.ID_PARTENAIRE_SERVICE) AS NBRE_PRODUITS FROM ecommerce_produits ep"
    sqlQuery += " LEFT JOIN partenaire_service ps ON ps.ID_PARTENAIRE_SERVICE=ep.ID_PARTENAIRE_SERVICE"
    sqlQuery += "  WHERE ep.ID_PARTENAIRE_SERVICE= ? GROUP BY ep.ID_PARTENAIRE_SERVICE "
    return query(sqlQuery, binds);

  }
  catch (error) {
    throw error

  }
}
module.exports = {
  findproducts,
  findproductCommande,
  updateImage,
  findproductByID,
  findproductsResearch,
  findCategories,
  findSousCategoriesBy,
  findSizes,
  findSize,
  findSousCategories,
  findone,
  findById, findBYidPartenaire,
  findproduct,
  findBYidPartenaire,
  getPrix,
  findColor,
  findQte,
  createNotes,
  findBYidProduitPartenaire,
  findnoteProduitPartenaire,
  getdetail,
  findCategoriesPartnaire,
  findByServiceProduits,
  findNoteUser,
  updateOne,
  findByIdNote



}