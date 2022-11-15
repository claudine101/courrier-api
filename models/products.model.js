const { query } = require("../utils/db");

const findproduct = async (id,category, subCategory, limit = 10, offset = 0) => {
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
              
              if(category) {
                        sqlQuery += " AND eps.ID_CATEGORIE_PRODUIT = ? "
                        binds.push(category)
              }
              if(subCategory) {
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
const findproducts = async (q,category, subCategory, limit = 10, offset = 0) => {

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
        sqlQuery += " WHERE   ps.ID_SERVICE=1 "
        if (q && q != "") {
            sqlQuery +=
                      "AND (ps.NOM_ORGANISATION LIKE ? OR imm.NOM_PROPRIETAIRE LIKE ? OR imm.PRENOM_PROPRIETAIRE LIKE ? ";
            sqlQuery +=
                      " OR imm.MODELE_VOITURE LIKE ? OR permis.NOM_PROPRIETAIRE LIKE ? OR permis.CATEGORIES LIKE ? OR hi.NUMERO_PERMIS LIKE ? OR hi.NUMERO_PLAQUE LIKE ? OR IF(hi.MONTANT != 0,hi.IS_PAID LIKE ?, '' ) )";
            binds.push(
                      `%${q}%`,
                      `%${q}%`,
                      `%${q}%`,
                      `%${q}%`,
                      `%${q}%`,
                      `%${q}%`,
                      `%${q}%`,
                      `%${q}%`,
                      `%${q}%`
            );
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
        var binds = []
        var sqlQuery = "SELECT ep.ID_PRODUIT,ps.ID_PARTENAIRE_SERVICE,epp.ID_PRODUIT_PARTENAIRE"
        sqlQuery+=" ,epc.NOM AS NOM_CATEGORIE,ep.NOM,ep.IMAGE_1,ep.IMAGE_2,ep.IMAGE_3,ps.NOM_ORGANISATION,"
        sqlQuery+= " ps.ID_TYPE_PARTENAIRE,epp.DESCRIPTION , eps.ID_PRODUIT_STOCK,epd.QUANTITE_TOTAL,"
        sqlQuery+=" epd.QUANTITE_VENDUS,sp.PRIX,epd.QUANTITE_RESTANTE ,ept.TAILLE,ep.ID_CATEGORIE_PRODUIT,"
        sqlQuery+=" ep.ID_PRODUIT_SOUS_CATEGORIE  FROM ecommerce_produits ep  LEFT JOIN partenaire_service ps"
        sqlQuery+=" ON ps.ID_PARTENAIRE_SERVICE=ep.ID_PARTENAIRE_SERVICE   LEFT JOIN  partenaires par"
        sqlQuery+=" ON par.ID_PARTENAIRE=ps.ID_PARTENAIRE  LEFT JOIN users u ON u.ID_USER=par.ID_USER LEFT"
        sqlQuery+=" JOIN ecommerce_produit_partenaire epp  ON epp.ID_PRODUIT=ep.ID_PRODUIT LEFT JOIN "
        sqlQuery+=" ecommerce_produit_stock eps ON eps.ID_PRODUIT_PARTENAIRE=epp.ID_PRODUIT_PARTENAIRE"
        sqlQuery+=" LEFT JOIN ecommerce_produit_tailles ept  ON ept.ID_TAILLE=eps.	ID_TAILLE LEFT JOIN "
        sqlQuery+=" ecommerce_produit_categorie epc ON epc.ID_CATEGORIE_PRODUIT=ep.ID_CATEGORIE_PRODUIT "
        sqlQuery +=" LEFT JOIN ecommerce_stock_prix sp ON sp.ID_PRODUIT_STOCK=eps.ID_PRODUIT_STOCK LEFT JOIN"
        sqlQuery+=" ecommerce_statut_prix stp ON stp.ID_STATUT=sp.ID_STATUT LEFT JOIN ecommerce_produit_details" 
        sqlQuery+=" epd ON epd.ID_PRODUIT_STOCK=eps.ID_PRODUIT_STOCK WHERE stp.ID_STATUT=1 AND epd.QUANTITE_RESTANTE>0 AND ps.ID_SERVICE=1   AND ps.ID_PARTENAIRE_SERVICE=?"
          
        
        sqlQuery += ` ORDER BY eps.DATE_INSERTION DESC LIMIT ${offset}, ${limit}`;
        return query(sqlQuery, [ID_PARTENAIRE_SERVICE]);
    }
    catch (error) {
        throw error

    }
}
const createNotes = (ID_USER,ID_PRODUIT_PARTENAIRE,NOTE,COMMENTAIRE) => {
    try {
      var sqlQuery = "INSERT INTO ecommerce_produit_notes (ID_USER,ID_PRODUIT_PARTENAIRE,NOTE,COMMENTAIRE)";
     // console.log(ID_USER,ID_PRODUIT_PARTENAIRE,NOTE,COMMENTAIRE)
      sqlQuery += "values (?,?,?,?)";
      return query(sqlQuery, [
        ID_USER,ID_PRODUIT_PARTENAIRE,NOTE,COMMENTAIRE])
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

const findById = async (id) => {
    try {
        var sqlQuery = "SELECT epn.ID_NOTE, epn.NOTE,epn.COMMENTAIRE,epn.ID_PRODUIT_PARTENAIRE,u.NOM,u.PRENOM, epn.ID_USER,epn.DATE_INSERTION,u.IMAGE FROM ecommerce_produit_notes epn LEFT JOIN users u ON epn.ID_USER=u.ID_USER   WHERE epn.ID_NOTE=?";
        return query(sqlQuery, [id]);

    }
    catch (error) {
        throw error
    }
}
const findBYidProduitPartenaire = async (id,limit = 10, offset = 0) => {
    try {
        var sqlQuery = "SELECT epn.NOTE,epn.COMMENTAIRE,epn.ID_PRODUIT_PARTENAIRE,u.NOM,u.PRENOM,"
        sqlQuery+=" epn.ID_USER,epn.DATE_INSERTION,u.IMAGE FROM ecommerce_produit_notes epn LEFT JOIN"
        sqlQuery +=" users u ON epn.ID_USER=u.ID_USER   WHERE epn.ID_PRODUIT_PARTENAIRE=?"
        sqlQuery+=` ORDER BY epn.DATE_INSERTION DESC LIMIT ${offset}, ${limit}`;
        return query(sqlQuery, [id]);

    }
    catch (error) {
        throw error
    }
} 
const findnoteProduitPartenaire = async (ID_PRODUIT_PARTENAIRE,id) => {
    try {
        var sqlQuery = "SELECT epn.NOTE,epn.COMMENTAIRE,epn.ID_PRODUIT_PARTENAIRE,u.NOM,u.PRENOM,"
        sqlQuery+=" epn.ID_USER,epn.DATE_INSERTION,u.IMAGE FROM ecommerce_produit_notes epn LEFT JOIN"
        sqlQuery +=" users u ON epn.ID_USER=u.ID_USER   WHERE epn.ID_PRODUIT_PARTENAIRE=? AND  epn.ID_USER=?"
        //sqlQuery+=` ORDER BY epn.DATE_INSERTION DESC LIMIT ${offset}, ${limit}`;
        return query(sqlQuery, [ID_PRODUIT_PARTENAIRE,id]);

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
        sqlQuery +=" LEFT JOIN ecommerce_produit_details epd ON epd.ID_PRODUIT_STOCK=eps.ID_PRODUIT_STOCK "
        sqlQuery +=" LEFT JOIN ecommerce_produit_tailles ept ON ept.ID_TAILLE=epd.ID_TAILLE WHERE eps.ID_PRODUIT_PARTENAIRE=?"
        return query(sqlQuery,binds);
        
    }
    catch (error) {
        throw error

    }
}
const findColor = async (ID_PRODUIT_PARTENAIRE,ID_TAILLE) => {
    try {
            var binds = [ID_PRODUIT_PARTENAIRE,ID_TAILLE]
            var sqlQuery = " SELECT epc.ID_COULEUR,epc.COULEUR  ,epd.QUANTITE_RESTANTE FROM   ecommerce_produit_stock eps  "
            sqlQuery +=" LEFT JOIN ecommerce_produit_details epd ON epd.ID_PRODUIT_STOCK=eps.ID_PRODUIT_STOCK " 
            sqlQuery +=" LEFT JOIN ecommerce_produit_tailles ept ON ept.ID_TAILLE=epd.ID_TAILLE "
            sqlQuery +=" LEFT JOIN ecommerce_produit_couleur  epc ON epc.ID_COULEUR=epd.ID_COULEUR "
            sqlQuery +=" WHERE eps.ID_PRODUIT_PARTENAIRE=? AND epd.ID_TAILLE=? "
  
        return query(sqlQuery,binds);
        
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
    findSize,
    findSousCategories,
    findone,
    findById, findBYidPartenaire,
    findproduct,
    findBYidPartenaire,
    getPrix,
    findColor,
    createNotes,
    findBYidProduitPartenaire,
    findnoteProduitPartenaire
   
   
    
}