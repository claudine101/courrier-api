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

const createProduitPrix = (ID_PRODUIT_STOCK, PRIX, ID_STATUT
        ) => {
                try {
                        var sqlQuery = "INSERT INTO  ecommerce_stock_prix(ID_PRODUIT_STOCK, PRIX, ID_STATUT)";
                        sqlQuery += "values (?,?,?)";
                        return query(sqlQuery, [ID_PRODUIT_STOCK, PRIX, ID_STATUT])
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

const createProduitPartenaire = (ID_PARTENAIRE_SERVICE, ID_PRODUIT, DESCRIPTION
        ) => {
                try {
                        var sqlQuery = "INSERT INTO  ecommerce_produit_partenaire(ID_PARTENAIRE_SERVICE, ID_PRODUIT, DESCRIPTION)";
                        sqlQuery += "values (?,?,?)";
                        return query(sqlQuery, [ID_PARTENAIRE_SERVICE, ID_PRODUIT, DESCRIPTION])
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

const createProduitDetailStock = (ID_PRODUIT_STOCK, ID_COULEUR,	ID_TAILLE, ID_MARQUE, QUANTITE_TOTAL, QUANTITE_VENDUS, QUANTITE_RESTANTE
        ) => {
                try {
                        var sqlQuery = "INSERT INTO ecommerce_produit_details (ID_PRODUIT_STOCK, ID_COULEUR,ID_TAILLE, ID_MARQUE, QUANTITE_TOTAL, QUANTITE_VENDUS, QUANTITE_RESTANTE)";
                        sqlQuery += "values (?,?,?,?,?,?,?)";
                        return query(sqlQuery, [ID_PRODUIT_STOCK, ID_COULEUR,ID_TAILLE, ID_MARQUE, QUANTITE_TOTAL, QUANTITE_VENDUS, QUANTITE_RESTANTE])
                }
                catch (error) {
        
                        throw error
                }
        }



const findproduits = async (limit = 10, offset = 0) => {
        try {
                var binds = []
                var sqlQuery = "SELECT eco_p_part.ID_PRODUIT_PARTENAIRE,eco_p_part.ID_PARTENAIRE_SERVICE,eco_p_part.ID_PRODUIT,eco_p_part.DESCRIPTION,"
                sqlQuery += " eco_pro.NOM,eco_pro.IMAGE_1,eco_pro.IMAGE_2,eco_pro.IMAGE_3, eco_p_cat.NOM AS NOM_CATEGORIE, eco_p_cat.ID_CATEGORIE_PRODUIT,eco_p_s_cat.NOM AS NOM_SOUS_CATEGORIE, eco_p_s_cat.ID_PRODUIT_SOUS_CATEGORIE, "
                sqlQuery += " eco_st_pr.PRIX FROM ecommerce_produit_partenaire eco_p_part "
                sqlQuery += " LEFT JOIN ecommerce_produits eco_pro ON eco_pro.ID_PRODUIT=eco_p_part.ID_PRODUIT "
                sqlQuery += " LEFT JOIN ecommerce_produit_categorie eco_p_cat ON eco_p_cat.ID_CATEGORIE_PRODUIT=eco_pro.ID_CATEGORIE_PRODUIT "
                sqlQuery += "  LEFT JOIN ecommerce_produit_stock eco_pro_st ON eco_pro_st.ID_PRODUIT_PARTENAIRE=eco_p_part.ID_PRODUIT_PARTENAIRE "
                sqlQuery += " LEFT JOIN  ecommerce_stock_prix eco_st_pr ON eco_st_pr.ID_STOCK_PRIX=eco_pro_st.ID_PRODUIT_STOCK "
                sqlQuery += "  LEFT JOIN ecommerce_produit_sous_categorie eco_p_s_cat ON eco_p_s_cat.ID_PRODUIT_SOUS_CATEGORIE=eco_pro.ID_PRODUIT_SOUS_CATEGORIE "


                sqlQuery += ` ORDER BY eco_pro.NOM DESC LIMIT ${offset}, ${limit}`;
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
        createProduitCouleur,
        createProduitPartenaire,
        createProduitPrix,
        createProduitDetailStock
}