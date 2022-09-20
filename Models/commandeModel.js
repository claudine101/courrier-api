const { query } = require("../utils/db");

const findAll = async () => {
        try {
                return query("SELECT * FROM ecommerce_clients_livraison WHERE 1")
        }
        catch (error) {
                throw error;
        }
};

const createCommandes = async (ID_USER, ID_LIVRAISON, PRIX_COMMANDE, PRIX_LIVRAISON, SOMME_TOTALE,
        ID_STATUT, ID_LIVREUR, DATE_DEBUT_LIVRAISON, DATE_FIN_LIVRAISON) => {
        try {
                var sqlQuery = "INSERT INTO ecommerce_commandes(ID_USER, ID_LIVRAISON, PRIX_COMMANDE, PRIX_LIVRAISON, SOMME_TOTALE,ID_STATUT,ID_LIVREUR, DATE_DEBUT_LIVRAISON, DATE_FIN_LIVRAISON)";
                sqlQuery += "VALUES(?,?,?,?,?,?,?,?,?)"
                return query(sqlQuery, [
                        ID_USER, ID_LIVRAISON, PRIX_COMMANDE, PRIX_LIVRAISON, SOMME_TOTALE,
                        ID_STATUT, ID_LIVREUR, DATE_DEBUT_LIVRAISON, DATE_FIN_LIVRAISON
                ]);
        } catch (error) {
                throw error
        }

}

const createCommandeDetails = async (ID_COMMANDE, ID_PRODUIT_STOCK, QUANTITE, PRIX, SOMME) => {
        try {
                var sqlQuery = "INSERT INTO ecommerce_commande_details(ID_COMMANDE, ID_PRODUIT_STOCK, QUANTITE, PRIX, SOMME)";
                sqlQuery += "VALUES(?,?,?,?,?)"
                return query(sqlQuery, [ID_COMMANDE, ID_PRODUIT_STOCK, QUANTITE, PRIX, SOMME]);
        } catch (error) {
                throw error
        }

}

const createLivraisons = async (ID_USER, NOM, PRENOM, ADRESSE, LONGITUDE, LATITUDE) => {
        try {
                var sqlQuery = "INSERT INTO ecommerce_clients_livraison(ID_USER, NOM, PRENOM, ADRESSE, LONGITUDE, LATITUDE)";
                sqlQuery += "VALUES(?,?,?,?,?,?)"
                return query(sqlQuery, [ID_USER, NOM, PRENOM, ADRESSE, LONGITUDE, LATITUDE]);
        } catch (error) {
                throw error
        }

}

const findCommandes = async (userId) => {
        try {
                return query("SELECT * FROM ecommerce_commandes WHERE ID_USER=?",[userId])
        }
        catch (error) {
                throw error;
        }
};


module.exports = {
        findAll,
        createCommandes,
        createCommandeDetails,
        createLivraisons,
        findCommandes
}