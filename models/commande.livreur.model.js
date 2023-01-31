const { query } = require("../utils/db");

const getCommandesPartenaire = async (idDriverCourse) => {
        try {
                  var binds = [idDriverCourse]
                  var sqlQuery = "SELECT co.*, ecs.DESCRIPTION STATUT_DESCRIPTION, ecs.NEXT_STATUS FROM ecommerce_commandes co "
                  sqlQuery += " LEFT JOIN ecommerce_commande_statut ecs ON ecs.ID_STATUT = co.ID_STATUT "
                  sqlQuery += " WHERE co.ID_DRIVER_COURSE IN (?) AND co.ID_STATUT != 1 ORDER BY co.DATE_COMMANDE DESC "
                  return query(sqlQuery, binds)
        }
        catch (error) {
                  throw error;
        }
};

const getCommandesDetails = async (commandesIds) => {
        try {
                  var binds = [commandesIds]
                  var sqlQuery = " SELECT cd.ID_COMMANDE, cd.ID_COMMANDE_DETAIL, cd.QUANTITE, cd.PRIX, cd.SOMME, ep.NOM, ep.IMAGE_1 FROM ecommerce_commande_details cd"
                  sqlQuery += "  LEFT JOIN ecommerce_produits ep ON ep.ID_PRODUIT=cd.ID_PRODUIT WHERE ID_COMMANDE IN (?)"
                  return query(sqlQuery, binds)
  
        }catch (error) {
                  throw error
        }
}

const getCommandesPartenaireResto = async (idDriverCourse) => {
        try {
                var binds = [idDriverCourse]
                var sqlQuery = "SELECT co.*, ecs.DESCRIPTION STATUT_DESCRIPTION, ecs.NEXT_STATUS FROM restaurant_commandes co "
                sqlQuery += " LEFT JOIN restaurant_commande_statut ecs ON ecs.ID_STATUT = co.ID_STATUT "
                sqlQuery += " WHERE co.ID_DRIVER_COURSE IN (?) AND co.ID_STATUT != 1 ORDER BY co.DATE_COMMANDE DESC "
                return query(sqlQuery, binds)
        }
        catch (error) {
                  throw error;
        }
};

const getCommandesDetailsResto = async (commandesIds) => {
        try {
                var binds = [commandesIds]
                var sqlQuery = " SELECT cd.ID_COMMANDE, cd.ID_COMMANDE_DETAIL, cd.QUANTITE, cd.MONTANT, cd.SOMME, ep.NOM, ep.IMAGE_1 FROM restaurant_commandes_details cd"
                sqlQuery += "  LEFT JOIN  restaurant_menus ep ON ep.ID_RESTAURANT_MENU=cd.ID_RESTAURANT_MENU WHERE ID_COMMANDE IN (?)"
                return query(sqlQuery, binds)
  
        }catch (error) {
                  throw error
        }
}



module.exports = {
        getCommandesDetails,
        getCommandesPartenaire,
        getCommandesPartenaireResto,
        getCommandesDetailsResto
}
