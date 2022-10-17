const { query } = require("../utils/db")

const createProduitStock = (ID_PRODUIT_PARTENAIRE, ID_TAILLE, QUANTITE_TOTAL, QUANTITE_VENDUS, QUANTITE_RESTANTE
) => {
        try {
                var sqlQuery = "INSERT INTO  ecommerce_produit_stock (	ID_PRODUIT_PARTENAIRE, ID_TAILLE, QUANTITE_TOTAL,QUANTITE_VENDUS,QUANTITE_RESTANTE)";
                sqlQuery += "values (?,?,?,?,?)";
                return query(sqlQuery, [ID_PRODUIT_PARTENAIRE, ID_TAILLE, QUANTITE_TOTAL, QUANTITE_VENDUS, QUANTITE_RESTANTE])
        }
        catch (error) {

                throw error
        }
}

const createProduit = (ID_CATEGORIE_PRODUIT, ID_PRODUIT_SOUS_CATEGORIE, NOM, IMAGE_1, IMAGE_2, IMAGE_3, IS_AUTRE, ID_PARTENAIRE_SERVICE
) => {
        try {
                var sqlQuery = "INSERT INTO  ecommerce_produits(ID_CATEGORIE_PRODUIT, ID_PRODUIT_SOUS_CATEGORIE, NOM, IMAGE_1, IMAGE_2, IMAGE_3, IS_AUTRE,ID_PARTENAIRE_SERVICE)";
                sqlQuery += "values (?,?,?,?,?,?,?,?)";
                return query(sqlQuery, [ID_CATEGORIE_PRODUIT, ID_PRODUIT_SOUS_CATEGORIE, NOM, IMAGE_1, IMAGE_2, IMAGE_3, IS_AUTRE, ID_PARTENAIRE_SERVICE])
        }
        catch (error) {

                throw error
        }
}


const createProduitTaille = async (ID_CATEGORIE_PRODUIT, ID_PRODUIT_SOUS_CATEGORIE, TAILLE, IS_AUTRE, ID_PARTENAIRE_SERVICE) => {
        try {
                  var sqlQuery = "INSERT INTO ecommerce_produit_tailles(ID_CATEGORIE_PRODUIT, ID_PRODUIT_SOUS_CATEGORIE, TAILLE, IS_AUTRE, ID_PARTENAIRE_SERVICE)";
                  sqlQuery += "VALUES (?,?,?,?,?)"
                  return query(sqlQuery, [ID_CATEGORIE_PRODUIT, ID_PRODUIT_SOUS_CATEGORIE, TAILLE, IS_AUTRE, ID_PARTENAIRE_SERVICE]);
        } catch (error) {
                  throw error
        }

}


const createProduitCouleur = async (COULEUR, ID_CATEGORIE_PRODUIT, ID_PRODUIT_SOUS_CATEGORIE, IS_AUTRE, ID_PARTENAIRE_SERVICE) => {
        try {
                  var sqlQuery = "INSERT INTO ecommerce_produit_couleur(COULEUR, ID_CATEGORIE_PRODUIT, ID_PRODUIT_SOUS_CATEGORIE, IS_AUTRE, ID_PARTENAIRE_SERVICE)";
                  sqlQuery += "VALUES (?,?,?,?,?)"
                  return query(sqlQuery, [COULEUR, ID_CATEGORIE_PRODUIT, ID_PRODUIT_SOUS_CATEGORIE, IS_AUTRE, ID_PARTENAIRE_SERVICE]);
        } catch (error) {
                  throw error
        }

}



const findproduits = async (limit = 10, offset = 0) => {
        try {
                var binds = []
                var sqlQuery = "SELECT ep.ID_PRODUIT, ep.NOM,ep.ID_CATEGORIE_PRODUIT,ep.ID_PRODUIT_SOUS_CATEGORIE,ep.IMAGE_1,ep.IMAGE_2,ep.IMAGE_3,ep.IS_AUTRE,ep.ID_PARTENAIRE_SERVICE, ep_c.NOM AS NOM_CATEGORIE, ec_s_c.NOM AS NOM_SOUS_CATEGORIE"
                sqlQuery += " FROM ecommerce_produits ep "
                sqlQuery += " LEFT JOIN ecommerce_produit_categorie ep_c ON ep_c.ID_CATEGORIE_PRODUIT=ep.ID_CATEGORIE_PRODUIT "
                sqlQuery += "  LEFT JOIN  ecommerce_produit_sous_categorie ec_s_c ON ec_s_c.ID_PRODUIT_SOUS_CATEGORIE=ep.ID_PRODUIT_SOUS_CATEGORIE WHERE 1 "

                sqlQuery += ` ORDER BY ep.NOM DESC LIMIT ${offset}, ${limit}`;
                return query(sqlQuery, [binds]);
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

const findSousCategories = async (id_categorie) => {
        try {
            var sqlQuery ="SELECT * FROM ecommerce_produit_sous_categorie ec_s_c LEFT JOIN ecommerce_produit_categorie ec ON ec_s_c.ID_CATEGORIE_PRODUIT=ec.ID_CATEGORIE_PRODUIT WHERE ec.ID_CATEGORIE_PRODUIT=?";
            return query(sqlQuery, [id_categorie]);
       
        }
        catch (error) {
            throw error
        }
    }


const findCouleurs = async (ID_CATEGORIE_PRODUIT, ID_PRODUIT_SOUS_CATEGORIE) => {
        try {
        
            var binds = [ID_CATEGORIE_PRODUIT]
            var sqlQuery = "SELECT * FROM ecommerce_produit_couleur WHERE ID_CATEGORIE_PRODUIT = ?"
        
            if(ID_PRODUIT_SOUS_CATEGORIE){
                sqlQuery += " AND ID_PRODUIT_SOUS_CATEGORIE=? "
                binds.push(ID_PRODUIT_SOUS_CATEGORIE)
            }
            // sqlQuery += `LIMIT ${offset}, ${limit}`;
                  return query(sqlQuery, binds);
        }
        catch (error) {
            throw error
    
        }
    }

    const findTailles = async (ID_CATEGORIE_PRODUIT,ID_PRODUIT_SOUS_CATEGORIE) => {
        try {
        
            var binds = [ID_CATEGORIE_PRODUIT]
            var sqlQuery = "SELECT * FROM ecommerce_produit_tailles WHERE ID_CATEGORIE_PRODUIT=?"
            
            if(ID_PRODUIT_SOUS_CATEGORIE){
                sqlQuery += " AND ID_PRODUIT_SOUS_CATEGORIE=? "
                binds.push(ID_PRODUIT_SOUS_CATEGORIE)
            }
            // sqlQuery += `LIMIT ${offset}, ${limit}`;
                  return query(sqlQuery, binds);
        }
        catch (error) {
            throw error
    
        }
    }


module.exports = {
        createProduitStock,
        createProduit,
        createProduitTaille,
        findproduits,
        findCategories,
        findSousCategories,
        findCouleurs,
        findTailles,
        createProduitCouleur
}