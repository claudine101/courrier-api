const { query } = require("../utils/db");

const findAll = async () => {
        try {
                return query("SELECT * FROM ecommerce_clients_livraison WHERE 1")
        }
        catch (error) {
                throw error;
        }
};

const createCommandes = async (ID_USER,DATE_LIVRAISON,CODE_UNIQUE) => {
        try {
                var sqlQuery = "INSERT INTO ecommerce_commandes(ID_USER,DATE_LIVRAISON,CODE_UNIQUE)";
                sqlQuery += "VALUES(?,?,?)"
                return query(sqlQuery, [ID_USER,DATE_LIVRAISON,CODE_UNIQUE]);
        } catch (error) {
                throw error
        }

}
const createDetailLivraison = async (CODE_UNIQUE,N0M,PRENOM,ADRESSE,AVENUE,ID_COUNTRY) => {
        try {
                var sqlQuery = "INSERT  INTO driver_details_livraison(CODE_UNIQUE,N0M,PRENOM,ADRESSE,AVENUE,ID_COUNTRY)";
                sqlQuery += "VALUES(?,?,?,?,?,?)"
                return query(sqlQuery, [CODE_UNIQUE,N0M,PRENOM,ADRESSE,AVENUE,ID_COUNTRY]);
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
const findCommandesbyId = async (userId) => {
        try {
                return query("SELECT comm.DATE_COMMANDE,comm.DATE_LIVRAISON,comm.CODE_UNIQUE,comm.STATUT_LIVRAISON,comm.ID_STATUT , us.NOM, us.PRENOM FROM ecommerce_commandes comm LEFT JOIN users us on us.ID_USER=comm.ID_USER WHERE comm.ID_COMMANDE = ?",[userId])
        }
        catch (error) {
                throw error;
        }
};
const findDetail = async (ID_USER) => {
        try {
                return query("SELECT ecd.SOMME,ecs.DESCRIPTION ,ecd.QUANTITE,ec.DATE_COMMANDE FROM ecommerce_commandes ec LEFT JOIN ecommerce_commande_details ecd  ON ec.ID_COMMANDE=ecd.ID_COMMANDE LEFT JOIN ecommerce_commande_statut ecs ON ecs.ID_STATUT=ec.ID_STATUT LEFT JOIN users u ON u.ID_USER =ec.ID_USER WHERE 1 AND ec.ID_USER=?",[ID_USER])
        }
        catch (error) {
                throw error;
        }
};

const findProduit= async (userId) => {
        try {
                var sqlQuery = "SELECT com.ID_COMMANDE_DETAIL,prx.NOM,com.QUANTITE, "
                sqlQuery += "com.SOMME,com.PRIX FROM ecommerce_commande_details com  "
                sqlQuery +="LEFT JOIN  ecommerce_produit_stock st ON  "
                sqlQuery +="com.ID_PRODUIT_STOCK=st.ID_PRODUIT_STOCK LEFT JOIN " 
                sqlQuery +="ecommerce_produit_partenaire  pr  ON pr.ID_PRODUIT_PARTENAIRE=st.ID_PRODUIT_PARTENAIRE  "
                sqlQuery +="LEFT JOIN ecommerce_produits prx ON prx.ID_PRODUIT=pr.ID_PARTENAIRE  "
                sqlQuery +=" WHERE com.ID_COMMANDE=?",[userId]
                return query(sqlQuery, [userId]);

        }
        catch (error) {
                throw error;
        }
};


const findAllLivraisonById = async (userId) => {
        try {
                return query("SELECT livr.NOM,livr.PRENOM, livr.ADRESSE, livr.LONGITUDE, livr.LATITUDE FROM ecommerce_clients_livraison livr WHERE livr.ID_LIVRAISON=?",[userId])
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
        findDetail
}