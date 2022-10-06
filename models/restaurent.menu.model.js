const { query } = require("../utils/db");

const createMenu = (ID_CATEGORIE_MENU, ID_SOUS_CATEGORIE_MENU, ID_SOUS_SOUS_CATEGORIE, ID_REPAS, ID_PARTENAIRE, IMAGES_1, IMAGES_2, IMAGES_3, ID_USER
) => {
    try {
        var sqlQuery = "INSERT INTO restaurant_menu (ID_CATEGORIE_MENU,ID_SOUS_CATEGORIE_MENU,ID_SOUS_SOUS_CATEGORIE,ID_REPAS,ID_PARTENAIRE,IMAGES_1,IMAGES_2,IMAGES_3,ID_USER)";
        sqlQuery += "values (?,?,?,?,?,?,?,?,?)";
        return query(sqlQuery, [ID_CATEGORIE_MENU, ID_SOUS_CATEGORIE_MENU, ID_SOUS_SOUS_CATEGORIE, ID_REPAS, ID_PARTENAIRE, IMAGES_1, IMAGES_2, IMAGES_3, ID_USER])
    }
    catch (error) {

        throw error
    }
};

// const createRepas = (ID_PARTENAIRE, ID_TYPE_REPAS, DESCRIPTION, DESCRIPTION_FOURNISSEUR
// ) => {
//     try {
//         var sqlQuery = "INSERT INTO restaurant_repas (ID_PARTENAIRE,ID_TYPE_REPAS, DESCRIPTION,DESCRIPTION_FOURNISSEUR)";
//         sqlQuery += "values (?,?,?,?)";
//         return query(sqlQuery, [ID_PARTENAIRE, ID_TYPE_REPAS, DESCRIPTION, DESCRIPTION_FOURNISSEUR])
//     }
//     catch (error) {

//         throw error
//     }
// };

const createMenuTaille = (ID_RESTAURANT_MENU, ID_CATEGORIE_MENU, QUANTITE,DESCRIPTION, ID_UNITE
) => {
    try {
        var sqlQuery = "INSERT INTO restaurant_menu_quantite (ID_RESTAURANT_MENU,ID_CATEGORIE_MENU,QUANTITE,DESCRIPTION,ID_UNITE)";
        sqlQuery += "values (?,?,?,?,?)";
        return query(sqlQuery, [ID_RESTAURANT_MENU,ID_CATEGORIE_MENU,QUANTITE,DESCRIPTION,ID_UNITE])
    }
    catch (error) {

        throw error
    }
};

const createMenuPrix = (MONTANT, ID_STATUT_PRIX, ID_RESTAURANT_MENU, CODE_ACTIF
) => {
    try {
        var sqlQuery = "INSERT INTO restaurant_menu_prix(MONTANT, ID_STATUT_PRIX, ID_RESTAURANT_MENU, CODE_ACTIF)";
        sqlQuery += "values (?,?,?,?)";
        return query(sqlQuery, [MONTANT, ID_STATUT_PRIX, ID_RESTAURANT_MENU, CODE_ACTIF])
    }
    catch (error) {

        throw error
    }
}


// const findById = async (id) => {
//     try {
//         return query("SELECT * FROM  restaurant_menu WHERE ID_RESTAURANT_MENU=?", [id]);
//     } catch (error) {
//         throw error;
//     }
// };

const findById = async (id) => {
    try {
     
        return query("SELECT * FROM restaurant_menu menu LEFT JOIN  restaurant_categorie_menu c_menu ON menu.ID_CATEGORIE_MENU=c_menu.ID_CATEGORIE_MENU LEFT JOIN  restaurant_sous_categorie_menu sc_menu ON sc_menu.ID_SOUS_CATEGORIE_MENU=menu.ID_SOUS_CATEGORIE_MENU LEFT JOIN restaurant_sous_sous_categorie ssc_menu ON ssc_menu.ID_SOUS_SOUS_CATEGORIE=menu.ID_SOUS_SOUS_CATEGORIE LEFT JOIN restaurant_repas repas ON repas.ID_REPAS=menu.ID_REPAS LEFT JOIN partenaires part ON part.ID_PARTENAIRE=menu.ID_PARTENAIRE LEFT JOIN restaurant_menu_prix prix ON prix.ID_RESTAURANT_MENU=menu.ID_RESTAURANT_MENU LEFT JOIN restaurant_menu_quantite m_quantite ON m_quantite.ID_RESTAURANT_MENU=menu.ID_RESTAURANT_MENU WHERE menu.ID_RESTAURANT_MENU=?", [id]);
        // return query("SELECT * FROM restaurant_menu_taille rs_menu LEFT JOIN restaurant_menu ON restaurant_menu.ID_MENU_QUANTITE=rs_menu.ID_MENU_QUANTITE LEFT JOIN restaurant_menu_prix ON restaurant_menu_prix.ID_RESTAURANT_MENU=restaurant_menu.ID_RESTAURANT_MENU WHERE rs_menu.ID_MENU_QUANTITE=?", [id]);
    } catch (error) {
        throw error;
    }
};

const findAllRepas = async (ID_TYPE_REPAS) => {
    try {
        return query("SELECT repas.ID_REPAS, repas.DESCRIPTION FROM restaurant_repas repas LEFT JOIN restaurant_type_repas t ON t.ID_TYPE_REPAS=repas.ID_TYPE_REPAS  WHERE 1 AND repas.ID_TYPE_REPAS=?",[ID_TYPE_REPAS]);
    } catch (error) {
        throw error;
    }
};

const findAllCategories = async () => {
    try {
        return query("SELECT ID_CATEGORIE_MENU,NOM FROM restaurant_categorie_menu WHERE 1");
    } catch (error) {
        throw error;
    }
};

const findAllSousCategories = async () => {
    try {
        return query("SELECT ID_SOUS_CATEGORIE_MENU,NOM FROM restaurant_sous_categorie_menu WHERE 1");
    } catch (error) {
        throw error;
    }
};

const findAllSousSousCategories = async () => {
    try {
        return query("SELECT ID_SOUS_SOUS_CATEGORIE, DESCRIPTION FROM restaurant_sous_sous_categorie WHERE 1");
    } catch (error) {
        throw error;
    }
};

const findAllTypesRepas = async () => {
    try {
        return query("SELECT ID_TYPE_REPAS,DESCRIPTION FROM restaurant_type_repas WHERE 1");
    } catch (error) {
        throw error;
    }
};

const findAllUnites = async () => {
    try {
        return query("SELECT ID_UNITE, UNITES_MESURES FROM restaurant_menu_unite WHERE 1");
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createMenu,
    findById,
    findAllRepas,
    findAllCategories,
    findAllSousCategories,
    findAllSousSousCategories,
    findAllUnites,
    createMenuTaille,
    createMenuPrix,
    findAllTypesRepas

}