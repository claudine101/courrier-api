const { query } = require("../utils/db");
const findBy = async (column, value) => {
    try {
        var sqlQuery = `SELECT * FROM users JOIN partenaires ON users.ID_USER=partenaires.ID_USER WHERE users.${column} = ? `;
        return query(sqlQuery, [value]);
    }
    catch (error) {
        throw error;
    }
};
const createOne = (NOM, PRENOM, EMAIL, USERNAME, PASSWORD, ID_PROFIL, SEXE, DATE_NAISSANCE, COUNTRY_ID, ADRESSE, TELEPHONE_1, TELEPHONE_2, IMAGE) => {
    try {
        var sqlQuery = "INSERT INTO users (NOM,PRENOM,EMAIL,USERNAME,PASSWORD,ID_PROFIL,SEXE,DATE_NAISSANCE,COUNTRY_ID,ADRESSE,TELEPHONE_1,TELEPHONE_2,IMAGE)";
        sqlQuery += "values (?,?,?,?,?,?,?,?,?,?,?,?,?)";
        return query(sqlQuery, [
            NOM, PRENOM, EMAIL, USERNAME, PASSWORD, ID_PROFIL, SEXE, DATE_NAISSANCE, COUNTRY_ID, ADRESSE, TELEPHONE_1, TELEPHONE_2, IMAGE])
    }
    catch (error) {

        throw error
    }
}
const findById = async (id) => {
    try {
        return query("SELECT * FROM users u  LEFT JOIN partenaires p ON p.ID_USER=u.ID_USER WHERE p.ID_USER   = ?", [id]);
    } catch (error) {
        throw error;
    }
};
const findByIdPartenai = async (id) => {
    try {
        return query("SELECT * FROM partenaire_service WHERE ID_PARTENAIRE_SERVICE  = ?", [id]);
    } catch (error) {
        throw error;
    }
};
const findpartenaire = async (category, subCategory, limit = 10, offset = 0) => {
    try {
        var binds = []
        var sqlQuery = " SELECT ps.NOM_ORGANISATION,ps.ID_PARTENAIRE_SERVICE,u.IMAGE,ps.LOGO,ps.BACKGROUND_IMAGE FROM partenaire_service ps "
        sqlQuery += " LEFT JOIN partenaires p ON ps.ID_PARTENAIRE=p.ID_PARTENAIRE LEFT JOIN users u ON u.ID_USER=p.ID_USER "
        if (category) {
            sqlQuery = " SELEC u.IMAGE,ps.ID_PARTENAIRE_SERVICE,ep.ID_CATEGORIE_PRODUIT,ps.NOM_ORGANISATION  "
            sqlQuery += " FROM partenaire_service ps LEFT JOIN ecommerce_produits ep"
            sqlQuery += "  ON ep.ID_PARTENAIRE_SERVICE = ps.ID_PARTENAIRE_SERVICE LEFT JOIN users u  ON u.ID_USER=p.ID_USER WHERE ep.ID_PARTENAIRE_SERVICE=?  "
            binds.push(category)
        }
        sqlQuery += " WHERE ID_TYPE_PARTENAIRE = 2 AND ID_SERVICE = 1 "
        sqlQuery += `LIMIT ${offset}, ${limit}`;
        return query(sqlQuery, binds);
    }
    catch (error) {
        throw error
    }

}
// const findpartenaires = async (limit = 10, offset = 0) => {
//     try {
//         //var binds = []
//         var sqlQuery = " SELECT ps.NOM_ORGANISATION,ps.ID_PARTENAIRE_SERVICE,u.IMAGE,ps.LOGO,ps.BACKGROUND_IMAGE FROM partenaire_service ps "
//         sqlQuery += " LEFT JOIN partenaires p ON ps.ID_PARTENAIRE=p.ID_PARTENAIRE LEFT JOIN users u ON u.ID_USER=p.ID_USER "
//         sqlQuery += " WHERE ID_TYPE_PARTENAIRE = 2 AND ID_SERVICE = 1 "
//         sqlQuery += `LIMIT ${offset}, ${limit}`;
//         return query(sqlQuery);
//     }
//     catch (error) {
//         throw error
//     }

// }
const findbycategorie = async (id) => {
    try {

        var sqlQuery = "SELECT epc.NOM,COUNT(epc.ID_CATEGORIE_PRODUIT) NOMBRE_PRODUITS  FROM `ecommerce_produits` epp  LEFT JOIN ecommerce_produit_categorie epc  ON epc.ID_CATEGORIE_PRODUIT = epp.ID_CATEGORIE_PRODUIT  WHERE epp.ID_PARTENAIRE_SERVICE=? GROUP BY epc.ID_CATEGORIE_PRODUIT  ORDER BY NOMBRE_PRODUITS "
     
        return query(sqlQuery, [id]);
    }
    catch (error) {
        throw error
    }
}
const findByIdPartenaire = async (id, category, subCategory, limit = 10, offset = 0) => {
    try {
        var binds = [id]
        var sqlQuery = "SELECT ep.ID_PRODUIT, ep.NOM, ep.IMAGE, "
        sqlQuery += " pp.ID_PRODUIT_PARTENAIRE, pp.NOM AS NOM_PRODUIT_PARTENAIRE,pp.DESCRIPTION,pp.IMAGE_1,pp.IMAGE_2, pp.IMAGE_3, "
        sqlQuery += " pas.NOM_ORGANISATION, p.ID_PARTENAIRE, pas.ID_TYPE_PARTENAIRE, u.NOM NOM_USER, u.PRENOM, "
        sqlQuery += " pc.ID_CATEGORIE_PRODUIT, pc.NOM AS NOM_CATEGORIE, psc.ID_PRODUIT_SOUS_CATEGORIE, psc.NOM AS NOM_SOUS_CATEGORIE,sp.PRIX, "
        sqlQuery += " ps.ID_PRODUIT_STOCK, ps.QUANTITE_STOCKE, ps.QUANTITE_RESTANTE, ps.QUANTITE_VENDUE "
        sqlQuery += "FROM ecommerce_produit_partenaire pp "
        sqlQuery += " LEFT JOIN ecommerce_produits ep ON ep.ID_PRODUIT=pp.ID_PRODUIT "
        sqlQuery += " LEFT JOIN partenaires p ON pp.ID_PARTENAIRE=p.ID_PARTENAIRE "
        sqlQuery += " LEFT JOIN partenaire_service pas ON pas.ID_PARTENAIRE = p.ID_PARTENAIRE AND pas.ID_SERVICE = 1 "
        sqlQuery += " LEFT JOIN users u ON u.ID_USER=p.ID_USER "
        sqlQuery += " LEFT JOIN ecommerce_produit_categorie pc ON pc.ID_CATEGORIE_PRODUIT=pp.ID_CATEGORIE_PRODUIT "
        sqlQuery += " LEFT JOIN ecommerce_produit_sous_categorie psc ON psc.ID_PRODUIT_SOUS_CATEGORIE=pp.ID_PRODUIT_SOUS_CATEGORIE "
        sqlQuery += " LEFT JOIN ecommerce_produit_stock ps  ON ps.ID_PRODUIT_PARTENAIRE=pp.ID_PRODUIT_PARTENAIRE "
        sqlQuery += " LEFT JOIN  ecommerce_stock_prix sp ON sp.ID_PRODUIT_STOCK=ps.ID_PRODUIT_STOCK "
        sqlQuery += " WHERE p.ID_PARTENAIRE= ? AND sp.ID_STATUT = 1 "
        if (category) {
            sqlQuery += " AND pp.ID_CATEGORIE_PRODUIT = ? "
            binds.push(category)
        }
        if (subCategory) {
            sqlQuery += " AND pp.ID_PRODUIT_SOUS_CATEGORIE = ? "
            binds.push(subCategory)
        }
        sqlQuery += `LIMIT ${offset}, ${limit}`;
        return query(sqlQuery, [binds]);

    } catch (error) {
        throw error;
    }
};
const findcategories = async (ID_PARTENAIRE) => {
    try {
        var sqlQuery = "SELECT epc.ID_CATEGORIE_PRODUIT,epc.NOM,epc.IMAGE FROM ecommerce_produit_partenaire epp LEFT JOIN partenaires p ON p.ID_PARTENAIRE=epp.ID_PARTENAIRE  LEFT JOIN ecommerce_produit_categorie epc ON epc.ID_CATEGORIE_PRODUIT=epp.ID_CATEGORIE_PRODUIT WHERE 1 AND epp.ID_PARTENAIRE=?GROUP BY epc.ID_CATEGORIE_PRODUIT "


        return query(sqlQuery, [ID_PARTENAIRE]);

    } catch (error) {
        throw error;
    }
};
const createpartenaire = (ID_PARTENAIRE, ID_SERVICE, ID_TYPE_PARTENAIRE, NOM_ORGANISATION, TELEPHONE, NIF, EMAIL, LOGO, BACKGROUND_IMAGE, ADRESSE_COMPLETE, LATITUDE, LONGITUDE, PARTENAIRE_SERVICE_STATUT_ID = 2) => {
    try {
        var sqlQuery = "INSERT INTO partenaire_service (ID_PARTENAIRE, ID_SERVICE, ID_TYPE_PARTENAIRE, NOM_ORGANISATION, TELEPHONE, NIF, EMAIL,LOGO, BACKGROUND_IMAGE, ADRESSE_COMPLETE, LATITUDE, LONGITUDE, PARTENAIRE_SERVICE_STATUT_ID)";
        sqlQuery += "values (?,?,?,?,?,?,?,?,?,?,?, ?, ?)";
        return query(sqlQuery, [
            ID_PARTENAIRE, ID_SERVICE, ID_TYPE_PARTENAIRE, NOM_ORGANISATION, TELEPHONE, NIF, EMAIL, LOGO, BACKGROUND_IMAGE, ADRESSE_COMPLETE, LATITUDE, LONGITUDE, PARTENAIRE_SERVICE_STATUT_ID])
    }
    catch (error) {

        throw error
    }
}
const createOnePartenaire = (ID_USER) => {
    try {
        var sqlQuery = "INSERT INTO partenaires (ID_USER)";
        sqlQuery += "values (?)";
        return query(sqlQuery, [
            ID_USER])
    }
    catch (error) {

        throw error
    }
}
const CreatePartenaireService = (ID_PARTENAIRE, ID_SERVICE, PARTENAIRE_SERVICE_STATUT_ID) => {
    try {
        var sqlQuery = "INSERT INTO partenaire_service (ID_PARTENAIRE,ID_SERVICE,PARTENAIRE_SERVICE_STATUT_ID)";
        sqlQuery += "values (?,?,?)";
        return query(sqlQuery, [ID_PARTENAIRE, ID_SERVICE, PARTENAIRE_SERVICE_STATUT_ID
        ])
    }
    catch (error) {

        throw error
    }
}

module.exports = {
    findBy,
    createOne,
    findById,
    findpartenaire,
    findbycategorie,
    findByIdPartenaire,
    findcategories,
    findByIdPartenai,
    createpartenaire,
    CreatePartenaireService,
    createOnePartenaire,
    // findpartenaires
}