const { query } = require("../../utils/db");

const findproducts = async (q, category, subCategory, partenaireService,  limit = 10, offset = 0, min_prix, max_prix) => {
          try {
                    var binds = []
                    var sqlQuery = `
                    SELECT ep.*,
                              ps.NOM_ORGANISATION,
                              ps.ID_TYPE_PARTENAIRE,
                              ps.ID_PARTENAIRE,
                              ps.ID_PARTENAIRE_SERVICE,
                              ps.ADRESSE_COMPLETE,
                              ps.ID_SERVICE,
                              ps.LOGO,
                              ps.BACKGROUND_IMAGE,
                              ps.EMAIL,
                              ps.TELEPHONE,
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

                              sqlQuery += "AND ep.PRIX BETWEEN min_prix=? AND max_prix=?"
                              binds.push(min_prix && max_prix)

                    }

                    sqlQuery += ` ORDER BY ep.DATE_INSERTION DESC LIMIT ${offset}, ${limit}`;
                    return query(sqlQuery, binds);
          }
          catch (error) {
                    throw error

          }
}

const createProduit = async (ID_CATEGORIE_PRODUIT, ID_PRODUIT_SOUS_CATEGORIE = null, NOM, PRIX, DESCRIPTION, ID_PARTENAIRE_SERVICE, IMAGE_1, IMAGE_2, IMAGE_3) => {
          try {
                    var sqlQuery = `
                    INSERT INTO ecommerce_produits(
                              ID_CATEGORIE_PRODUIT,
                              ID_PRODUIT_SOUS_CATEGORIE,
                              NOM,
                              PRIX,
                              DESCRIPTION,
                              ID_PARTENAIRE_SERVICE,
                              IMAGE_1,
                              IMAGE_2,
                              IMAGE_3
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `
                    return query(sqlQuery, [ID_CATEGORIE_PRODUIT, ID_PRODUIT_SOUS_CATEGORIE = null, NOM, PRIX, DESCRIPTION, ID_PARTENAIRE_SERVICE, IMAGE_1, IMAGE_2, IMAGE_3])
          }
          catch (error) {
                    throw error
          }
}

module.exports = {
          findproducts,
          createProduit
}