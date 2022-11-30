const { query } = require("../utils/db");

const createMenu = (ID_REPAS, ID_CATEGORIE_MENU, ID_SOUS_CATEGORIE_MENU, ID_PARTENAIRE_SERVICE, PRIX, TEMPS_PREPARATION, DESCRIPTION, IMAGES_1, IMAGES_2, IMAGES_3
) => {
    try {
        var sqlQuery = "INSERT INTO restaurant_menus (ID_REPAS,ID_CATEGORIE_MENU,ID_SOUS_CATEGORIE_MENU,ID_PARTENAIRE_SERVICE,PRIX,TEMPS_PREPARATION, DESCRIPTION,IMAGES_1,IMAGES_2,IMAGES_3)";
        sqlQuery += "values (?,?,?,?,?,?,?,?,?,?)";
        return query(sqlQuery, [ID_REPAS, ID_CATEGORIE_MENU, ID_SOUS_CATEGORIE_MENU, ID_PARTENAIRE_SERVICE, PRIX, TEMPS_PREPARATION, DESCRIPTION, IMAGES_1, IMAGES_2, IMAGES_3])
    }
    catch (error) {

        throw error
    }
};
const createMenuTaille = (ID_RESTAURANT_MENU, ID_CATEGORIE_MENU, QUANTITE, DESCRIPTION, ID_UNITE
) => {
    try {
        var sqlQuery = "INSERT INTO restaurant_menu_quantite (ID_RESTAURANT_MENU,ID_CATEGORIE_MENU,QUANTITE,DESCRIPTION,ID_UNITE)";
        sqlQuery += "values (?,?,?,?,?)";
        return query(sqlQuery, [ID_RESTAURANT_MENU, ID_CATEGORIE_MENU, QUANTITE, DESCRIPTION, ID_UNITE])
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

// const findById = async (id) => {
//     try {

//         return query("SELECT * FROM restaurant_menus menu LEFT JOIN  restaurant_categorie_menu c_menu ON menu.ID_CATEGORIE_MENU=c_menu.ID_CATEGORIE_MENU LEFT JOIN  restaurant_sous_categorie_menu sc_menu ON sc_menu.ID_SOUS_CATEGORIE_MENU=menu.ID_SOUS_CATEGORIE_MENU WHERE menu.ID_RESTAURANT_MENU=?", [id]);
//     } catch (error) {
//         throw error;
//     }
// };

const findById = async (ID) => {
    try {
        var binds = [ID]
        var sqlQuery = "SELECT  menu.ID_RESTAURANT_MENU,menu.IMAGES_1,menu.IMAGES_2,menu.IMAGES_3 , rr.ID_REPAS,rr.NOM AS repas ,rr.DESCRIPTION,  "
        sqlQuery += " menu.PRIX,c_menu.ID_CATEGORIE_MENU,c_menu.NOM as categorie,sc_menu.ID_SOUS_CATEGORIE_MENU  FROM restaurant_menus menu LEFT JOIN  "
        sqlQuery += "restaurant_categorie_menu c_menu ON menu.ID_CATEGORIE_MENU=c_menu.ID_CATEGORIE_MENU "
        sqlQuery += "LEFT JOIN  restaurant_sous_categorie_menu sc_menu ON  "
        sqlQuery += "sc_menu.ID_SOUS_CATEGORIE_MENU=menu.ID_SOUS_CATEGORIE_MENU LEFT JOIN partenaire_service ps ON  "
        sqlQuery += "ps.ID_PARTENAIRE_SERVICE=menu.ID_PARTENAIRE_SERVICE "
        sqlQuery += "LEFT JOIN partenaires p on p.ID_PARTENAIRE=ps.ID_PARTENAIRE "
        sqlQuery += "LEFT JOIN restaurant_repas rr ON rr.ID_REPAS=menu.ID_REPAS "
        sqlQuery += "WHERE menu.ID_RESTAURANT_MENU=? "
        return query(sqlQuery, [ID]);

    }
    catch (error) {
        throw error

    }
}



const findAllRepas = async (ID_TYPE_REPAS) => {
    try {
        return query("SELECT repas.ID_REPAS, repas.DESCRIPTION FROM restaurant_repas repas LEFT JOIN restaurant_type_repas t ON t.ID_TYPE_REPAS=repas.ID_TYPE_REPAS  WHERE 1 AND repas.ID_TYPE_REPAS=?", [ID_TYPE_REPAS]);
    } catch (error) {
        throw error;
    }
};

const findAllCategories = async () => {
    try {
        return query("SELECT * FROM restaurant_categorie_menu WHERE 1");
    } catch (error) {
        throw error;
    }
};
const findAllCategoriesById = async (ID_PARTENAIRE_SERVICE) => {
    try {
        var sqlQuery = "SELECT  DISTINCT rcm.ID_CATEGORIE_MENU, "
        sqlQuery += "rcm.NOM  FROM partenaire_service ps LEFT JOIN "
        sqlQuery += "restaurant_menus rm  ON rm.ID_PARTENAIRE_SERVICE=ps.ID_PARTENAIRE_SERVICE "
        sqlQuery += "LEFT JOIN restaurant_categorie_menu rcm ON "
        sqlQuery += "rcm.ID_CATEGORIE_MENU=rm.ID_CATEGORIE_MENU WHERE ps.ID_PARTENAIRE_SERVICE= ?"
        return query(sqlQuery, [ID_PARTENAIRE_SERVICE]);

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

const createMenuUpdate = (ID_REPAS, ID_CATEGORIE_MENU, ID_SOUS_CATEGORIE_MENU, ID_PARTENAIRE_SERVICE, PRIX, TEMPS_PREPARATION, DESCRIPTION
) => {
    try {
        var sqlQuery = "INSERT INTO restaurant_menus (ID_REPAS,ID_CATEGORIE_MENU,ID_SOUS_CATEGORIE_MENU,ID_PARTENAIRE_SERVICE,PRIX,TEMPS_PREPARATION, DESCRIPTION)";
        sqlQuery += "values (?,?,?,?,?,?,?)";
        return query(sqlQuery, [ID_REPAS, ID_CATEGORIE_MENU, ID_SOUS_CATEGORIE_MENU, ID_PARTENAIRE_SERVICE, PRIX, TEMPS_PREPARATION, DESCRIPTION])
    }
    catch (error) {

        throw error
    }
};

const updateMenuRestaurant = (ID_RESTAURANT_MENU, ID_REPAS, ID_CATEGORIE_MENU, ID_SOUS_CATEGORIE_MENU, ID_PARTENAIRE_SERVICE, PRIX, TEMPS_PREPARATION, DESCRIPTION
) => {
    try {
        var sqlQuery = "UPDATE restaurant_menus SET ID_RESTAURANT_MENU=?, ID_REPAS=?,ID_CATEGORIE_MENU=?,ID_SOUS_CATEGORIE_MENU=?,ID_PARTENAIRE_SERVICE=?,PRIX=?,TEMPS_PREPARATION=?, DESCRIPTION=?";
        return query(sqlQuery, [ID_RESTAURANT_MENU, ID_REPAS, ID_CATEGORIE_MENU, ID_SOUS_CATEGORIE_MENU, ID_PARTENAIRE_SERVICE, PRIX, TEMPS_PREPARATION, DESCRIPTION])
    }
    catch (error) {

        throw error
    }
}

// const findMenuById = async (ID_RESTAURANT_MENU) => {
//     try {
//         var binds = [ID_RESTAURANT_MENU]
//         var sqlQuery = "SELECT menu.*, repa.NOM AS repas, catego.NOM AS categorie FROM restaurant_menus menu LEFT JOIN restaurant_repas repa ON menu.ID_REPAS=repa.ID_REPAS LEFT JOIN  restaurant_categorie_menu catego ON menu.ID_CATEGORIE_MENU=catego.ID_CATEGORIE_MENU WHERE menu.ID_RESTAURANT_MENU=?"
//         // sqlQuery += "LEFT JOIN restaurant_repas repa ON menu.ID_REPAS=repa.ID_REPAS "
//         // sqlQuery += "LEFT JOIN  restaurant_categorie_menu catego ON menu.ID_CATEGORIE_MENU=catego.ID_CATEGORIE_MENU "
//         // sqlQuery += "WHERE menu.ID_RESTAURANT_MENU=1 "
//         return query(sqlQuery, [binds]);

//     }
//     catch (error) {
//         throw error

//     }
// }





module.exports = {
    createMenu,
    findById,
    findAllRepas,
    findAllCategories,
    findAllCategoriesById,
    findAllSousCategories,
    findAllSousSousCategories,
    findAllUnites,
    createMenuTaille,
    createMenuPrix,
    findAllTypesRepas,
    createMenuUpdate,
    updateMenuRestaurant,
    // findMenuById

}