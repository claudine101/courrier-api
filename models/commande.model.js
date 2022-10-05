const { query } = require("../utils/db");

const findAll = async () => {
          try {
                    return query("SELECT * FROM ecommerce_clients_livraison WHERE 1")
          }
          catch (error) {
                    throw error;
          }
};

const createCommandes = async (ID_USER, DATE_LIVRAISON, CODE_UNIQUE) => {
          try {
                    var sqlQuery = "INSERT INTO ecommerce_commandes(ID_USER,DATE_LIVRAISON,CODE_UNIQUE)";
                    sqlQuery += "VALUES(?,?,?)"
                    return query(sqlQuery, [ID_USER, DATE_LIVRAISON, CODE_UNIQUE]);
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
const getUserCommandes = async (ID_USER, q, limit = 10, offset = 0) => {
          try {
                    var binds = [ID_USER]
                    var sqlQuery = "SELECT co.ID_STATUT, co.ID_COMMANDE, co.CODE_UNIQUE, co.DATE_COMMANDE, ecs.DESCRIPTION STATUT_DESCRIPTION FROM ecommerce_commandes co "
                    sqlQuery += " LEFT JOIN ecommerce_commande_statut ecs ON ecs.ID_STATUT = co.ID_STATUT "
                    sqlQuery += " WHERE co.ID_USER = ? AND co.ID_STATUT != 1 ORDER BY co.DATE_COMMANDE DESC "
                    sqlQuery += `LIMIT ${offset}, ${limit}`
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
                    return query(sqlQuery, binds)
          }
          catch (error) {
                    throw error;
          }
}

const getManyCommandesDetails = async (commandesIds) => {
          try {
                    var binds = [commandesIds]
                    var sqlQuery = "SELECT cd.ID_COMMANDE, cd.ID_COMMANDE_DETAIL, cd.QUANTITE, cd.PRIX, cd.SOMME, epp.NOM, epp.IMAGE_1 FROM ecommerce_commande_details cd "
                    sqlQuery += " LEFT JOIN ecommerce_produit_stock eps ON eps.ID_PRODUIT_STOCK = cd.ID_PRODUIT_STOCK "
                    sqlQuery += " LEFT JOIN ecommerce_produit_partenaire epp ON epp.ID_PRODUIT_PARTENAIRE = eps.ID_PRODUIT_PARTENAIRE "
                    sqlQuery += " WHERE ID_COMMANDE IN (?)"
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
          getOneCommande
}