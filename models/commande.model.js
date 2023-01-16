const { query } = require("../utils/db");

const findAll = async () => {
          try {
                    return query("SELECT * FROM ecommerce_clients_livraison WHERE 1")
          }
          catch (error) {
                    throw error;
          }
};

const createCommandes = async (ID_USER, DATE_LIVRAISON, CODE_UNIQUE, ID_STATUT = 1) => {
        try {
                var sqlQuery = "INSERT INTO ecommerce_commandes(ID_USER,DATE_LIVRAISON,CODE_UNIQUE, ID_STATUT)";
                sqlQuery += "VALUES(?,?,?, ?)"
                return query(sqlQuery, [ID_USER, DATE_LIVRAISON, CODE_UNIQUE, ID_STATUT]);
        } catch (error) {
                throw error
        }

}
const createDetailLivraison = async (CODE_UNIQUE, N0M, PRENOM, ADRESSE, TELEPHONE, AVENUE, ID_COUNTRY) => {
          try {
                    var sqlQuery = "INSERT  INTO driver_details_livraison(CODE_UNIQUE,N0M,PRENOM,ADRESSE,TELEPHONE,AVENUE,ID_COUNTRY)";
                    sqlQuery += "VALUES(?,?,?,?,?,?,?)"
                    return query(sqlQuery, [CODE_UNIQUE, N0M, PRENOM, ADRESSE, TELEPHONE, AVENUE, ID_COUNTRY]);
          } catch (error) {
                    throw error
          }

}

const createCommandeDetails = async (ecommerce_commande_details) => {
          try {
                    var sqlQuery = "INSERT INTO ecommerce_commande_details(ID_COMMANDE, ID_PRODUIT_STOCK, QUANTITE, PRIX, SOMME)";
                    sqlQuery += "VALUES ?"
                    return query(sqlQuery, [ecommerce_commande_details]);
          } catch (error) {
                    throw error
          }

}
const findCommandesbyId = async (userId) => {
          try {
                    return query("SELECT comm.DATE_COMMANDE,comm.DATE_LIVRAISON,comm.CODE_UNIQUE,comm.STATUT_LIVRAISON,comm.ID_STATUT , us.NOM, us.PRENOM FROM ecommerce_commandes comm LEFT JOIN users us on us.ID_USER=comm.ID_USER WHERE comm.ID_COMMANDE = ?", [userId])
          } 
          catch (error) {
                    throw error;
          }
};
const getUserCommandes = async (ID_USER,ID_SERVICE, q, limit = 10, offset = 0) => {
          try {
                    var binds = [ID_USER,ID_SERVICE]
                    var sqlQuery = "SELECT co.ID_STATUT, co.ID_COMMANDE, co.CODE_UNIQUE, co.DATE_COMMANDE, ecs.DESCRIPTION STATUT_DESCRIPTION, ecs.NEXT_STATUS FROM ecommerce_commandes co "
                    sqlQuery += " LEFT JOIN ecommerce_commande_statut ecs ON ecs.ID_STATUT = co.ID_STATUT "
                    sqlQuery += " LEFT JOIN ecommerce_produit_partenaire ecp ON ecp.ID_PRODUIT_PARTENAIRE=co.ID_PRODUIT_PARTENAIRE "
                    sqlQuery += " WHERE co.ID_USER = ? AND co.ID_STATUT != 1 ORDER BY co.DATE_COMMANDE DESC "
                    sqlQuery += `LIMIT ${offset}, ${limit}`
                    return query(sqlQuery, binds)
          }
          catch (error) {
                    throw error;
          }
};

const getUserCommandesResto = async (ID_USER,ID_SERVICE, q, limit = 10, offset = 0) => {
        try {
                  var binds = [ID_USER,ID_SERVICE]
                  var sqlQuery = "ELECT rc.ID_STATUT, rc.ID_COMMANDE, "
                  sqlQuery += "rc.CODE_UNIQUE, rc.DATE_COMMANDE, rcs.DESCRIPTION "
                  sqlQuery += " STATUT_DESCRIPTION, rcs.NEXT_STATUS FROM restaurant_commandes "
                  sqlQuery += " rc  LEFT JOIN restaurant_commande_statut rcs ON rcs.ID_STATUT = rc.ID_STATUT  "
                  sqlQuery += " LEFT JOIN restaurant_menus rm  ON rm.ID_RESTAURANT_MENU =rc.ID_RESTAURANT_MENU   "
                  sqlQuery += " WHERE rc.ID_USER = ?  AND rc.ID_STATUT != 1 "
                  sqlQuery += "ORDER BY rc.DATE_COMMANDE DESC "
                  sqlQuery += `LIMIT ${offset}, ${limit}`
                 
                //   var sqlQuery = "SELECT co.ID_STATUT, co.ID_COMMANDE, co.CODE_UNIQUE, co.DATE_COMMANDE, ecs.DESCRIPTION STATUT_DESCRIPTION, ecs.NEXT_STATUS FROM ecommerce_commandes co "
                //   sqlQuery += " LEFT JOIN ecommerce_commande_statut ecs ON ecs.ID_STATUT = co.ID_STATUT "
                //   sqlQuery += " LEFT JOIN ecommerce_produit_partenaire ecp ON ecp.ID_PRODUIT_PARTENAIRE=co.ID_PRODUIT_PARTENAIRE   "
                //   sqlQuery += " WHERE co.ID_USER = ? AND ecp.ID_PARTENAIRE_SERVICE=? AND co.ID_STATUT != 1 ORDER BY co.DATE_COMMANDE DESC "
                //   sqlQuery += `LIMIT ${offset}, ${limit}`
                  return query(sqlQuery, binds)
        }
        catch (error) {
                  throw error;
        }
};
const getPartenaireCommandes = async (idPartenaire, q, limit = 10, offset = 0) => {
        try {
                  var binds = [idPartenaire]
                  var sqlQuery = " SELECT co.ID_STATUT, co.ID_COMMANDE, co.CODE_UNIQUE, co.DATE_COMMANDE, ecs.DESCRIPTION STATUT_DESCRIPTION, ecs.NEXT_STATUS, "
                  sqlQuery += "ecd.ID_COMMANDE_DETAIL ID_COMMANDE_DETAIL, ecd.QUANTITE, ecd.PRIX, ecd.SOMME, epp.NOM, epp.IMAGE_1 "
                  sqlQuery += " FROM ecommerce_commande_details ecd "
                  sqlQuery += " LEFT JOIN  ecommerce_commandes co ON co.ID_COMMANDE = ecd.ID_COMMANDE"
                  sqlQuery += " LEFT JOIN ecommerce_commande_statut ecs ON ecs.ID_STATUT = co.ID_STATUT"
                  sqlQuery += " LEFT JOIN ecommerce_produit_stock eps ON eps.ID_PRODUIT_STOCK = ecd.ID_PRODUIT_STOCK "
                  sqlQuery += " LEFT JOIN ecommerce_produit_partenaire epp ON epp.ID_PRODUIT_PARTENAIRE = eps.ID_PRODUIT_PARTENAIRE "
                  sqlQuery += ` WHERE epp.ID_PARTENAIRE = ? AND co.ID_STATUT != 1 ORDER BY co.DATE_COMMANDE DESC LIMIT ${offset}, ${limit}`
                  return query(sqlQuery, binds)
        }
        catch (error) {
                  throw error;
        }
};


const getOneCommande = async (ID_COMMANDE) => {
          try {
                    var binds = [ID_COMMANDE]
                    var sqlQuery = "SELECT co.ID_STATUT, co.ID_COMMANDE, co.CODE_UNIQUE, co.DATE_COMMANDE, ecs.DESCRIPTION STATUT_DESCRIPTION FROM ecommerce_commandes co "
                    sqlQuery += " LEFT JOIN ecommerce_commande_statut ecs ON ecs.ID_STATUT = co.ID_STATUT "
                    sqlQuery += " WHERE ID_COMMANDE = ? LIMIT 1"


                //     var sqlQuery = "SELECT co.ID_STATUT, co.ID_COMMANDE, co.CODE_UNIQUE, co.DATE_COMMANDE, "
                //     sqlQuery += "  ecs.DESCRIPTION STATUT_DESCRIPTION FROM restaurant_commandes co "
                //     sqlQuery += " LEFT JOIN restaurant_commande_statut ecs ON ecs.ID_STATUT = co.ID_STATUT "
                //     sqlQuery += "  WHERE ID_COMMANDE = ? LIMIT 1  "
                    return query(sqlQuery, binds)
          }
          catch (error) {
                    throw error;
          }
}
const getOneCommandeResto = async (ID_COMMANDE) => {
        try {
                  var binds = [ID_COMMANDE]
                  var sqlQuery = "SELECT co.ID_STATUT, co.ID_COMMANDE, co.CODE_UNIQUE, co.DATE_COMMANDE, "
                  sqlQuery += "  ecs.DESCRIPTION STATUT_DESCRIPTION FROM restaurant_commandes co "
                  sqlQuery += " LEFT JOIN restaurant_commande_statut ecs ON ecs.ID_STATUT = co.ID_STATUT "
                  sqlQuery += "  WHERE ID_COMMANDE = ? LIMIT 1  "
                  return query(sqlQuery, binds)
        }
        catch (error) {
                  throw error;
        }
}
const getCommandeDetails = async (ID_COMMANDE ,ID_USERS) => {
        try {
                  var binds = [ID_COMMANDE ,ID_USERS]
                  var sqlQuery = " SELECT ec.CODE_UNIQUE,ep.ID_PRODUIT,ec.ID_COMMANDE, ecd.ID_COMMANDE_DETAIL,eps.ID_PRODUIT_STOCK,"
                  sqlQuery += "epp.ID_PRODUIT_PARTENAIRE,ep.IMAGE_1,ep.NOM, "
                  sqlQuery += " ecd.PRIX,ecd.QUANTITE,ecd.SOMME FROM  ecommerce_commandes ec "
                  sqlQuery += "LEFT JOIN  ecommerce_commande_details ecd ON ecd.ID_COMMANDE=ec.ID_COMMANDE "
                  sqlQuery += "LEFT JOIN ecommerce_produit_stock eps ON eps.ID_PRODUIT_STOCK=ecd.ID_PRODUIT_STOCK "
                  sqlQuery += "LEFT JOIN ecommerce_produit_partenaire epp ON epp.ID_PRODUIT_PARTENAIRE=eps.ID_PRODUIT_PARTENAIRE "
                  sqlQuery += " LEFT JOIN ecommerce_produits ep ON ep.ID_PRODUIT=epp.ID_PRODUIT WHERE  ec.ID_COMMANDE=? AND ec.ID_USER=? "
                  return query(sqlQuery, binds)
        }
        catch (error) {
                  throw error;
        }
}
const getCommandeDetailsRsto = async (ID_COMMANDE ,ID_USERS) => {
        try {
                  var binds = [ID_COMMANDE ,ID_USERS]
                  var sqlQuery = "  SELECT ec.CODE_UNIQUE,rr.ID_REPAS,ec.ID_COMMANDE, "
                  sqlQuery += "ecd.ID_COMMANDE_DETAIL,rm.ID_RESTAURANT_MENU, "
                  sqlQuery += "rm.IMAGES_1,rr.NOM,rm.PRIX,ecd.QUANTITE,ecd.SOMME FROM  "
                  sqlQuery += "restaurant_commandes ec LEFT JOIN  restaurant_commandes_details "
                  sqlQuery += "ecd ON ecd.ID_COMMANDE=ec.ID_COMMANDE LEFT JOIN  restaurant_menus "
                  sqlQuery += "rm ON rm.ID_RESTAURANT_MENU=ec.ID_RESTAURANT_MENU LEFT "
                  sqlQuery += "join restaurant_repas rr ON rr.ID_REPAS=rm.ID_REPAS "
                  sqlQuery += "WHERE  ec.ID_COMMANDE=? AND ec.ID_USER=? "
                  return query(sqlQuery, binds)
        }
        catch (error) {
                  throw error;
        }
}

// const getPartenaireCommandes = async (ID_USER, q, limit = 10, offset = 0) => {
//         try {
//                   var binds = [ID_USER]
//                   var sqlQuery = "SELECT co.ID_STATUT, co.ID_COMMANDE, co.CODE_UNIQUE, co.DATE_COMMANDE, ecs.DESCRIPTION STATUT_DESCRIPTION FROM ecommerce_commandes co "
//                   sqlQuery += " LEFT JOIN ecommerce_commande_statut ecs ON ecs.ID_STATUT = co.ID_STATUT "
//                   sqlQuery += " WHERE co.ID_USER = ? AND co.ID_STATUT != 1 ORDER BY co.DATE_COMMANDE DESC "
//                   sqlQuery += `LIMIT ${offset}, ${limit}`
//                   return query(sqlQuery, binds)
//         }
//         catch (error) {
//                   throw error;
//         }
// };

const getManyCommandesDetails = async (commandesIds) => {
          try {
                    var binds = [commandesIds]
                    var sqlQuery = "SELECT cd.ID_COMMANDE, cd.ID_COMMANDE_DETAIL, cd.QUANTITE, cd.PRIX, cd.SOMME, ep.NOM, ep.IMAGE_1 FROM ecommerce_commande_details cd "
                    sqlQuery += " LEFT JOIN ecommerce_produit_stock eps ON eps.ID_PRODUIT_STOCK = cd.ID_PRODUIT_STOCK "
                    sqlQuery += " LEFT JOIN ecommerce_produit_partenaire epp ON epp.ID_PRODUIT_PARTENAIRE = eps.ID_PRODUIT_PARTENAIRE "
                    sqlQuery += "  LEFT JOIN ecommerce_produits ep ON ep.ID_PRODUIT=epp.ID_PRODUIT WHERE ID_COMMANDE IN (?)"
                    return query(sqlQuery, binds)
    
          }catch (error) {
                    throw error
          }
}
const getManyCommandesDetailsResto = async (commandesIds) => {
        try {
                  var binds = [commandesIds]
                  var sqlQuery = " SELECT rcd.ID_COMMANDE_DETAIL,rcd.ID_COMMANDE ,rcd.QUANTITE, rcd.MONTANT, "
                  sqlQuery += "rcd.SOMME,rr.NOM , rm.IMAGES_1  FROM restaurant_commandes_details  "
                  sqlQuery += "rcd LEFT JOIN restaurant_menus rm ON rm.ID_RESTAURANT_MENU=rcd.ID_RESTAURANT_MENU  "
                  sqlQuery += "LEFT JOIN restaurant_repas rr ON rr.ID_REPAS=rm.ID_REPAS WHERE rcd.ID_COMMANDE IN (?) "
                  return query(sqlQuery, binds)
        }catch (error) {
                  throw error
        }
}
const getCommandesDetails = async (PartenaireIds) => {
        try {
                  var binds = [PartenaireIds]
                //   var sqlQuery = "SELECT  SUM(cd.SOMME) AS SOMME ,SUM(cd.QUANTITE) AS QUANTITE,cd.ID_COMMANDE,ecs.DESCRIPTION,ec.ID_COMMANDE,ec.CODE_UNIQUE, cd.ID_COMMANDE_DETAIL, cd.PRIX, epp.NOM, epp.IMAGE_1 FROM ecommerce_commande_details cd "
                  sqlQuery += " LEFT JOIN ecommerce_produit_stock eps ON eps.ID_PRODUIT_STOCK = cd.ID_PRODUIT_STOCK "
                  sqlQuery += " LEFT JOIN ecommerce_produit_partenaire epp ON epp.ID_PRODUIT_PARTENAIRE = eps.ID_PRODUIT_PARTENAIRE "
                  sqlQuery += " LEFT JOIN  ecommerce_commandes ec ON ec.ID_COMMANDE=cd.ID_COMMANDE LEFT JOIN ecommerce_commande_statut ecs ON ecs.ID_STATUT=ec.ID_STATUT"
                  sqlQuery += " WHERE cd.ID_PRODUIT_STOCK IN (?) GROUP BY cd.ID_COMMANDE"
                  return query(sqlQuery, binds)
        }catch (error) {
                  throw error
        }
}

const findProduit = async (userId) => {
          try {
                    var sqlQuery = "SELECT com.ID_COMMANDE_DETAIL,prx.NOM,com.QUANTITE, "
                    sqlQuery += "com.SOMME,com.PRIX FROM ecommerce_commande_details com  "
                    sqlQuery += "LEFT JOIN  ecommerce_produit_stock st ON  "
                    sqlQuery += "com.ID_PRODUIT_STOCK=st.ID_PRODUIT_STOCK LEFT JOIN "
                    sqlQuery += "ecommerce_produit_partenaire  pr  ON pr.ID_PRODUIT_PARTENAIRE=st.ID_PRODUIT_PARTENAIRE  "
                    sqlQuery += "LEFT JOIN ecommerce_produits prx ON prx.ID_PRODUIT=pr.ID_PARTENAIRE  "
                    sqlQuery += " WHERE com.ID_COMMANDE=?", [userId]
                    return query(sqlQuery, [userId]);

          }
          catch (error) {
                    throw error;
          }
};


const findAllLivraisonById = async (userId) => {
          try {
                    return query("SELECT livr.NOM,livr.PRENOM, livr.ADRESSE, livr.LONGITUDE, livr.LATITUDE FROM ecommerce_clients_livraison livr WHERE livr.ID_LIVRAISON=?", [userId])
          }
          catch (error) {
                    throw error;
          }
};

const saveStatus = async (ID_COMMANDE, ID_USER, ID_STATUT) => {
          try {
                    return query("INSERT INTO ecommerce_commande_statut_historiques(ID_COMMANDE, ID_USER, ID_STATUT) VALUES(?, ?, ?)", [ID_COMMANDE, ID_USER, ID_STATUT])
          } catch (error) {
                    throw error;
          }
}

const getPartenaireProduit = async (ID_USER) => {
        try {
                  return query("SELECT stock.ID_PRODUIT_STOCK, stock.QUANTITE_STOCKE, stock.QUANTITE_RESTANTE, stock.QUANTITE_VENDUE, p_part.ID_PRODUIT_PARTENAIRE, part.ID_PARTENAIRE FROM ecommerce_produit_stock stock LEFT JOIN ecommerce_produit_partenaire p_part ON p_part.ID_PRODUIT_PARTENAIRE=stock.ID_PRODUIT_PARTENAIRE LEFT JOIN partenaires part ON part.ID_PARTENAIRE=p_part.ID_PARTENAIRE WHERE part.ID_USER=?", [ID_USER])
        } catch (error) {
                  throw error;
        }
}

const getAllCommandesDetails = async (produitdIds) => {
        try {
                  return query("SELECT * FROM ecommerce_commandes comm LEFT JOIN  ecommerce_commande_details comm_d ON comm_d.ID_COMMANDE=comm.ID_COMMANDE WHERE  comm_d.ID_PRODUIT_STOCK IN (?)", [produitdIds])
        } catch (error) {
                  throw error;
        }
}

const createNewCommandes = async (ID_USER, DATE_LIVRAISON, CODE_UNIQUE, ID_STATUT = 1) => {
        try {
                var sqlQuery = "INSERT INTO restaurant_commandes(ID_USER,DATE_LIVRAISON,CODE_UNIQUE, ID_STATUT)";
                sqlQuery += "VALUES(?,?,?, ?)"
                return query(sqlQuery, [ID_USER, DATE_LIVRAISON, CODE_UNIQUE, ID_STATUT]);
        } catch (error) {
                throw error
        }

}

const createCommandeRestoDetails = async (restaurant_commande_details) => {
        try {
                  var sqlQuery = "INSERT INTO restaurant_commandes_details(ID_COMMANDE, ID_RESTAURANT_MENU, QUANTITE, MONTANT, SOMME)";
                  sqlQuery += "VALUES ?"
                  return query(sqlQuery, [restaurant_commande_details]);
        } catch (error) {
                  throw error
        }

}

const getOneRestoCommande = async (ID_COMMANDE) => {
        try {
                  var binds = [ID_COMMANDE]
                  var sqlQuery = "SELECT co.ID_STATUT, co.ID_COMMANDE, co.CODE_UNIQUE, co.DATE_COMMANDE, ecs.DESCRIPTION STATUT_DESCRIPTION FROM restaurant_commandes co "
                  sqlQuery += " LEFT JOIN restaurant_commande_statut ecs ON ecs.ID_STATUT = co.ID_STATUT "
                  sqlQuery += " WHERE ID_COMMANDE = ? LIMIT 1"
                  return query(sqlQuery, binds)
        }
        catch (error) {
                  throw error;
        }
}

// const getManyCommandesRestoDetails = async (commandesIds) => {
//         try {
//                   var binds = [commandesIds]
//                   var sqlQuery = "SELECT * FROM restaurant_commandes_details cd "
//                   sqlQuery += " LEFT JOIN restaurant_menu eps ON eps.ID_RESTAURANT_MENU = cd.ID_RESTAURANT_MENU "
//                   sqlQuery += " LEFT JOIN restaurant_repas epp ON epp.ID_REPAS = eps.ID_REPAS "
//                   sqlQuery += " WHERE ID_COMMANDE IN (?)"
//                   return query(sqlQuery, binds)
//         }catch (error) {
//                   throw error
//         }
// }

const getUserRestoCommandes = async (ID_USER, q, limit = 10, offset = 0) => {
        try {
                  var binds = [ID_USER]
                  var sqlQuery = "SELECT * FROM restaurant_commandes co "
                  sqlQuery += " LEFT JOIN restaurant_commande_statut ecs ON ecs.ID_STATUT = co.ID_STATUT "
                  sqlQuery += " WHERE co.ID_USER = ? AND co.ID_STATUT != 1 ORDER BY co.DATE_COMMANDE DESC "
                  sqlQuery += `LIMIT ${offset}, ${limit}`
                  return query(sqlQuery, binds)
        }
        catch (error) {
                  throw error;
        }
}

const getManyCommandesRestoDetails = async (commandesIds) => {
        try {
                  var binds = [commandesIds]
                  var sqlQuery = "SELECT * FROM restaurant_commandes_details cd "
                  sqlQuery += " LEFT JOIN restaurant_menu eps ON eps.ID_RESTAURANT_MENU = cd.ID_RESTAURANT_MENU "
                  sqlQuery += " LEFT JOIN restaurant_repas epp ON epp.ID_REPAS = eps.ID_REPAS "
                  sqlQuery += " WHERE ID_COMMANDE IN (?)"
                  return query(sqlQuery, binds)
        }catch (error) {
                  throw error
        }
}
const saveStatusResto = async (ID_COMMANDE, ID_USER, ID_STATUT) => {
        try {
                  return query("INSERT INTO restaurant_commande_statut_historiques(ID_COMMANDE, ID_USER, ID_STATUT) VALUES(?, ?, ?)", [ID_COMMANDE, ID_USER, ID_STATUT])
        } catch (error) {
                  throw error;
        }
}

const getUserCountCommandes = async (ID_USER,ID_SERVICE, q, limit = 10, offset = 0) => {
        try {
                  var binds = [ID_USER,ID_SERVICE]
                  var sqlQuery = "SELECT co.ID_STATUT,COUNT(co.ID_COMMANDE) AS NBRE, co.ID_COMMANDE, co.CODE_UNIQUE, co.DATE_COMMANDE, ecs.DESCRIPTION STATUT_DESCRIPTION, ecs.NEXT_STATUS FROM ecommerce_commandes co "
                  sqlQuery += " LEFT JOIN ecommerce_commande_statut ecs ON ecs.ID_STATUT = co.ID_STATUT "
                  sqlQuery += " LEFT JOIN ecommerce_produit_partenaire ecp ON ecp.ID_PRODUIT_PARTENAIRE=co.ID_PRODUIT_PARTENAIRE "
                  sqlQuery += " WHERE co.ID_USER = ? AND co.ID_STATUT != 4 ORDER BY co.DATE_COMMANDE DESC "
                  sqlQuery += `LIMIT ${offset}, ${limit}`
                  return query(sqlQuery, binds)
        }
        catch (error) {
                  throw error;
        }
};



module.exports = {
          findAll,
          createCommandes,
          createCommandeDetails,
          findCommandesbyId,
          findAllLivraisonById,
          findProduit,
          createDetailLivraison,
          getUserCommandes,
          getManyCommandesDetails,
          saveStatus,
          getOneCommande,
          getPartenaireCommandes,
          getCommandesDetails,
          getPartenaireProduit,
          getAllCommandesDetails,
          createNewCommandes,
          createCommandeRestoDetails,
          getOneRestoCommande,
          getUserRestoCommandes,
          getManyCommandesRestoDetails,
          saveStatusResto,
          getCommandeDetails,
          getUserCommandesResto,
          getManyCommandesDetailsResto,
          getOneCommandeResto,
          getCommandeDetailsRsto,
          getUserCountCommandes
}