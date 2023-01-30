const { query } = require("../utils/db");
const getProductsVendus = async (ID_PRODUIT) => {
        try {
                var binds = [ID_PRODUIT]
                var sqlQuery = `SELECT COUNT(eco_d.ID_COMMANDE_DETAIL) AS NOMBRE
                                FROM ecommerce_commande_details eco_d
                                        LEFT JOIN ecommerce_produits eco_p ON eco_d.ID_PRODUIT = eco_p.ID_PRODUIT
                                WHERE eco_d.ID_PRODUIT = ?
                                GROUP BY eco_p.ID_PRODUIT`
                return query(sqlQuery, binds);
        }
        catch (error) {
                throw error
        }

}

const getCountProducts = async (ID_PRODUIT) => {
        try {
                var binds = [ID_PRODUIT]
                var sqlQuery = `SELECT COUNT(eco_p.ID_PRODUIT) AS NOMBRE
                                FROM ecommerce_produits eco_p
                                        LEFT JOIN ecommerce_variant_combination eco_v ON eco_p.ID_PRODUIT = eco_v.ID_PRODUIT
                                WHERE eco_p.ID_PRODUIT = ?
                                GROUP BY eco_p.ID_PRODUIT`
                return query(sqlQuery, binds);
        }
        catch (error) {
                throw error
        }

}

const getNotesProducts = async (ID_PRODUIT) => {
        try {
                var binds = [ID_PRODUIT]
                var sqlQuery = `SELECT SUM(NOTE) AS NOTE
                                FROM ecommerce_produit_notes
                                WHERE ID_PRODUIT = ?`
                return query(sqlQuery, binds);
        }
        catch (error) {
                throw error
        }

}

const getWishlist = async (ID_PRODUIT) => {
        try {
                var binds = [ID_PRODUIT]
                var sqlQuery = `SELECT COUNT(ID_WISHLIST) AS NOMBRE
                                FROM ecommerce_wishlist_produit
                                WHERE ID_PRODUIT = ?
                                GROUP BY ID_PRODUIT`
                return query(sqlQuery, binds);
        }
        catch (error) {
                throw error
        }

}
module.exports = {
        getProductsVendus,
        getCountProducts,
        getNotesProducts,
        getWishlist
}