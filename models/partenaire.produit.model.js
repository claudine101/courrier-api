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

const findByIdPartenaire = async (idPartenaire,id_partenaire_service, category, subCategory, limit = 10, offset = 0) => {
          try {
                    var binds = [idPartenaire,id_partenaire_service]
                    var sqlQuery = "SELECT eco_p_part.ID_PRODUIT_PARTENAIRE,eco_p_part.ID_PARTENAIRE_SERVICE,eco_p_part.ID_PRODUIT,eco_p_part.DESCRIPTION,"
                    sqlQuery += " eco_p.NOM, eco_p.IMAGE_1, eco_p.IMAGE_2, eco_p.IMAGE_3,part_s.NOM_ORGANISATION, part_s.TELEPHONE,part_s.EMAIL,part_s.LOGO, "
                    sqlQuery += " eco_p_c.ID_CATEGORIE_PRODUIT,eco_p_c.NOM AS NOM_CATEGORIE, eco_p_s_c.ID_PRODUIT_SOUS_CATEGORIE, eco_p_s_c.NOM AS SOUS_CATEGORIE  FROM ecommerce_produit_partenaire eco_p_part"
 
                    sqlQuery += " LEFT JOIN ecommerce_produits eco_p ON eco_p.ID_PRODUIT=eco_p_part.ID_PRODUIT "
                    sqlQuery += " LEFT JOIN partenaire_service part_s ON part_s.ID_PARTENAIRE_SERVICE=eco_p_part.ID_PARTENAIRE_SERVICE"
                    sqlQuery += " LEFT JOIN partenaires part ON part.ID_PARTENAIRE=part_s.ID_PARTENAIRE "
                    sqlQuery += " LEFT JOIN  users us ON us.ID_USER=part.ID_USER "
                    sqlQuery += " LEFT JOIN ecommerce_produit_categorie eco_p_c ON eco_p_c.ID_CATEGORIE_PRODUIT=eco_p.ID_CATEGORIE_PRODUIT "
                    sqlQuery += " LEFT JOIN ecommerce_produit_sous_categorie eco_p_s_c ON eco_p_s_c.ID_PRODUIT_SOUS_CATEGORIE=eco_p.ID_PRODUIT_SOUS_CATEGORIE "
                    sqlQuery += " WHERE part.ID_PARTENAIRE=? AND part_s.ID_PARTENAIRE_SERVICE=? "
                    if(category) {
                              sqlQuery += " AND eco_p_c.ID_CATEGORIE_PRODUIT = ? "
                              binds.push(category)
                    }
                    if(subCategory) {
                              sqlQuery += " AND eco_p_s_c.ID_PRODUIT_SOUS_CATEGORIE = ? "
                              binds.push(subCategory)
                    }
                    // sqlQuery += " ORDER BY pp.DATE_INSERTION DESC "
                    sqlQuery += `LIMIT ${offset}, ${limit}`;
                    return query(sqlQuery, binds);
          }
          catch (error) {
                    throw error
          }

    }

    const findAllPrix = async (id) => {
        try {
            var sqlQuery = " SELECT eco_s_pr.PRIX,eco_p_st.QUANTITE_TOTAL,eco_p_st.QUANTITE_VENDUS,eco_p_st.QUANTITE_RESTANTE, "
            sqlQuery += " eco_p_cou.COULEUR,eco_p_cou.ID_COULEUR, eco_p_tai.TAILLE,eco_p_tai.ID_TAILLE FROM ecommerce_stock_prix eco_s_pr "
            sqlQuery += " LEFT JOIN ecommerce_statut_prix eco_s_p ON eco_s_p.ID_STATUT=eco_s_pr.ID_STATUT "
            sqlQuery += " LEFT JOIN ecommerce_produit_stock eco_p_st ON eco_p_st.ID_PRODUIT_STOCK=eco_s_pr.ID_PRODUIT_STOCK "
            sqlQuery += " LEFT JOIN ecommerce_produit_details eco_p_de ON eco_p_de.ID_PRODUIT_STOCK=eco_p_st.ID_PRODUIT_STOCK "
            sqlQuery += " LEFT JOIN ecommerce_produit_couleur eco_p_cou ON eco_p_cou.ID_COULEUR=eco_p_de.ID_COULEUR "
            sqlQuery += " LEFT JOIN ecommerce_produit_tailles eco_p_tai ON eco_p_tai.ID_TAILLE=eco_p_de.ID_TAILLE "
            sqlQuery += " WHERE eco_s_p.ID_STATUT=1 AND eco_p_st.ID_PRODUIT_PARTENAIRE=? "
            return query(sqlQuery, [id]);

            // var sqlQuery = " SELECT eco_s_pr.PRIX,eco_p_st.QUANTITE_TOTAL,eco_p_st.QUANTITE_VENDUS,eco_p_st.QUANTITE_RESTANTE FROM ecommerce_stock_prix eco_s_pr "
            // sqlQuery += " LEFT JOIN ecommerce_statut_prix eco_s_p ON eco_s_p.ID_STATUT=eco_s_pr.ID_STATUT "
            // sqlQuery += " LEFT JOIN ecommerce_produit_stock eco_p_st ON eco_p_st.ID_PRODUIT_STOCK=eco_s_pr.ID_PRODUIT_STOCK "
            // sqlQuery += " WHERE eco_s_p.ID_STATUT=1 AND eco_p_st.ID_PRODUIT_PARTENAIRE=? "
            // return query(sqlQuery, [id]);
    
        }
        catch (error) {
            throw error
        }
    }

//     const findByIdPartenaire = async (idPartenaire, category, subCategory, limit = 10, offset = 0) => {
//         try {
//                   var binds = [idPartenaire]
//                   var sqlQuery = "SELECT ep.ID_PRODUIT, ep.NOM, ep.IMAGE, "
//                   sqlQuery += " pp.ID_PRODUIT_PARTENAIRE, pp.NOM AS NOM_PRODUIT_PARTENAIRE,pp.DESCRIPTION,pp.IMAGE_1,pp.IMAGE_2, pp.IMAGE_3, "
//                   sqlQuery += " pas.NOM_ORGANISATION, p.ID_PARTENAIRE, pas.ID_TYPE_PARTENAIRE, u.NOM NOM_USER, u.PRENOM, "
//                   sqlQuery += " pc.ID_CATEGORIE_PRODUIT, pc.NOM AS NOM_CATEGORIE, psc.ID_PRODUIT_SOUS_CATEGORIE, psc.NOM AS NOM_SOUS_CATEGORIE,sp.PRIX, "
//                   sqlQuery += " ps.ID_PRODUIT_STOCK, ps.QUANTITE_STOCKE, ps.QUANTITE_RESTANTE, ps.QUANTITE_VENDUE "
//                   sqlQuery += "FROM ecommerce_produit_partenaire pp "
//                   sqlQuery += " LEFT JOIN ecommerce_produits ep ON ep.ID_PRODUIT=pp.ID_PRODUIT "
//                   sqlQuery += " LEFT JOIN partenaires p ON pp.ID_PARTENAIRE=p.ID_PARTENAIRE "
//                   sqlQuery += " LEFT JOIN partenaire_service pas ON pas.ID_PARTENAIRE = p.ID_PARTENAIRE AND pas.ID_SERVICE = 1 "
//                   sqlQuery += " LEFT JOIN users u ON u.ID_USER=p.ID_USER "
//                   sqlQuery += " LEFT JOIN ecommerce_produit_categorie pc ON pc.ID_CATEGORIE_PRODUIT=pp.ID_CATEGORIE_PRODUIT "
//                   sqlQuery += " LEFT JOIN ecommerce_produit_sous_categorie psc ON psc.ID_PRODUIT_SOUS_CATEGORIE=pp.ID_PRODUIT_SOUS_CATEGORIE "
//                   sqlQuery += " LEFT JOIN ecommerce_produit_stock ps  ON ps.ID_PRODUIT_PARTENAIRE=pp.ID_PRODUIT_PARTENAIRE "
//                   sqlQuery += " LEFT JOIN  ecommerce_stock_prix sp ON sp.ID_PRODUIT_STOCK=ps.ID_PRODUIT_STOCK "
//                   sqlQuery += " WHERE pp.ID_PARTENAIRE = ? AND sp.ID_STATUT = 1 "
//                   if(category) {
//                             sqlQuery += " AND pp.ID_CATEGORIE_PRODUIT = ? "
//                             binds.push(category)
//                   }
//                   if(subCategory) {
//                             sqlQuery += " AND pp.ID_PRODUIT_SOUS_CATEGORIE = ? "
//                             binds.push(subCategory)
//                   }
//                   sqlQuery += " ORDER BY pp.DATE_INSERTION DESC "
//                   sqlQuery += `LIMIT ${offset}, ${limit}`;
//                   return query(sqlQuery, binds);
//         }
//         catch (error) {
//                   throw error
//         }

//   }
const findByIdPoduit = async (userID, id) => {
          try {
                    return query("SELECT * FROM  partenaires p LEFT JOIN ecommerce_produit_partenaire par ON par.ID_PARTENAIRE=p.ID_PARTENAIRE LEFT JOIN  ecommerce_produits pro ON pro.ID_PRODUIT=par.ID_PRODUIT LEFT JOIN ecommerce_produit_stock st ON st.ID_PRODUIT_PARTENAIRE=par.ID_PRODUIT_PARTENAIRE LEFT  JOIN ecommerce_historique_approvisionnement histo on histo.ID_PRODUIT_STOCK=st.ID_PRODUIT_STOCK LEFT JOIN ecommerce_historique_ecoulement ec on ec.ID_PRODUIT_STOCK=st.ID_PRODUIT_STOCK WHERE p.ID_USER=? AND pro.ID_PRODUIT=?", [userID, id]);

          } catch (error) {
                    throw error;
          }
};

const findProduitAllDetail = async (id_produit_partenaire, category, subCategory, limit = 10, offset = 0) => {
    try {
              var binds = [id_produit_partenaire]
              var sqlQuery = "SELECT pro_part.ID_PRODUIT_PARTENAIRE, pro_part.ID_PARTENAIRE_SERVICE,pro_part.ID_PRODUIT,pro_part.DESCRIPTION,"
              sqlQuery += " pro.NOM,pro.IMAGE_1,pro.IMAGE_2,pro.IMAGE_3, eco_pro_de.ID_DETAIL, eco_pro_de.QUANTITE_TOTAL,"
              sqlQuery += "eco_pro_de.QUANTITE_VENDUS,eco_pro_de.QUANTITE_RESTANTE,pro_coul.ID_COULEUR,pro_coul.COULEUR, "

              sqlQuery += " pro_tai.ID_TAILLE,pro_tai.TAILLE, pro_cat.ID_CATEGORIE_PRODUIT, pro_cat.NOM AS NOM_CATEGORIE, pro_s_cat.ID_PRODUIT_SOUS_CATEGORIE, "
              sqlQuery += " pro_s_cat.NOM AS SOUS_CATEGORIE FROM ecommerce_produit_partenaire pro_part "
              sqlQuery += " LEFT JOIN ecommerce_produits pro ON pro.ID_PRODUIT=pro_part.ID_PRODUIT "
              sqlQuery += " LEFT JOIN ecommerce_produit_stock pro_sto ON pro_sto.ID_PRODUIT_PARTENAIRE=pro_part.ID_PRODUIT_PARTENAIRE"
              sqlQuery += " LEFT JOIN ecommerce_produit_details eco_pro_de ON eco_pro_de.ID_PRODUIT_STOCK=pro_sto.ID_PRODUIT_STOCK "
              sqlQuery += " LEFT JOIN ecommerce_produit_couleur pro_coul ON pro_coul.ID_COULEUR=eco_pro_de.ID_COULEUR "
              sqlQuery += " LEFT JOIN ecommerce_produit_tailles pro_tai ON pro_tai.ID_TAILLE=eco_pro_de.ID_TAILLE "
              sqlQuery += " LEFT JOIN ecommerce_produit_categorie pro_cat ON pro_cat.ID_CATEGORIE_PRODUIT=pro.ID_CATEGORIE_PRODUIT "
              sqlQuery += " LEFT JOIN ecommerce_produit_sous_categorie pro_s_cat ON pro_s_cat.ID_PRODUIT_SOUS_CATEGORIE=pro.ID_PRODUIT_SOUS_CATEGORIE "
              sqlQuery += " WHERE pro_part.ID_PRODUIT_PARTENAIRE=?"
              if(category) {
                        sqlQuery += " AND pro_cat.ID_CATEGORIE_PRODUIT = ? "
                        binds.push(category)
              }
              if(subCategory) {
                        sqlQuery += " AND pro_s_cat.ID_PRODUIT_SOUS_CATEGORIE = ? "
                        binds.push(subCategory)
              }
              // sqlQuery += " ORDER BY pp.DATE_INSERTION DESC "
              sqlQuery += `LIMIT ${offset}, ${limit}`;
              return query(sqlQuery, binds);
    }
    catch (error) {
              throw error
    }

}
module.exports = {
          createProduit,
          createStock,
          createPrix,
          findById,
          findByIdPartenaire,
          findByIdPoduit,
          createDetails,
          findAllPrix,
          findProduitAllDetail
}