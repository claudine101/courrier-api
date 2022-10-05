const { query } = require("../utils/db");

const createMenu = (ID_CATEGORIE_MENU, ID_SOUS_CATEGORIE_MENU, ID_SOUS_SOUS_CATEGORIE, ID_REPAS, ID_PARTENAIRE,ID_MENU_QUANTITE, IMAGES_1, IMAGES_2, IMAGES_3, ID_USER
) => {
    try {
        var sqlQuery = "INSERT INTO restaurant_menu (ID_CATEGORIE_MENU,ID_SOUS_CATEGORIE_MENU,ID_SOUS_SOUS_CATEGORIE,ID_REPAS,ID_PARTENAIRE,ID_MENU_QUANTITE,IMAGES_1,IMAGES_2,IMAGES_3,ID_USER)";
        sqlQuery += "values (?,?,?,?,?,?,?,?,?,?)";
        return query(sqlQuery, [ID_CATEGORIE_MENU, ID_SOUS_CATEGORIE_MENU, ID_SOUS_SOUS_CATEGORIE, ID_REPAS, ID_PARTENAIRE,ID_MENU_QUANTITE, IMAGES_1, IMAGES_2, IMAGES_3, ID_USER])
    }
    catch (error) {

        throw error
    }
};

const createRepas = (ID_PARTENAIRE, ID_TYPE_REPAS, DESCRIPTION, DESCRIPTION_FOURNISSEUR
) => {
    try {
        var sqlQuery = "INSERT INTO restaurant_repas (ID_PARTENAIRE,ID_TYPE_REPAS, DESCRIPTION,DESCRIPTION_FOURNISSEUR)";
        sqlQuery += "values (?,?,?,?)";
        return query(sqlQuery, [ID_PARTENAIRE, ID_TYPE_REPAS, DESCRIPTION, DESCRIPTION_FOURNISSEUR])
    }
    catch (error) {

        throw error
    }
};

const createMenuTaille = (ID_CATEGORIE_MENU, QUANTITE, DESCRIPTION, ID_UNITE
) => {
    try {
        var sqlQuery = "INSERT INTO restaurant_menu_taille (ID_CATEGORIE_MENU,QUANTITE, DESCRIPTION,ID_UNITE)";
        sqlQuery += "values (?,?,?,?)";
        return query(sqlQuery, [ID_CATEGORIE_MENU, QUANTITE, DESCRIPTION, ID_UNITE])
    }
    catch (error) {

        throw error
    }
};

const createMenuPrix = (MONTANT, ID_STATUT_PRIX, ID_RESTAURANT_MENU, ID_PRIX_CODE
) => {
    try {
        var sqlQuery = "INSERT INTO restaurant_menu_prix(MONTANT, ID_STATUT_PRIX, ID_RESTAURANT_MENU, ID_PRIX_CODE)";
        sqlQuery += "values (?,?,?,?)";
        return query(sqlQuery, [MONTANT, ID_STATUT_PRIX, ID_RESTAURANT_MENU, ID_PRIX_CODE])
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
        // return query("SELECT * FROM  restaurant_menu_taille rs_taille LEFT JOIN restaurant_menu ON restaurant_menu.ID_MENU_QUANTITE=rs_taille.ID_MENU_QUANTITE WHERE rs_taille.ID_MENU_QUANTITE=?", [id]);
        // return query("SELECT * FROM restaurant_menu_taille LEFT JOIN restaurant_menu ON restaurant_menu.ID_MENU_QUANTITE=restaurant_menu_taille.ID_MENU_QUANTITE LEFT JOIN restaurant_categorie_menu ON restaurant_categorie_menu.ID_CATEGORIE_MENU=restaurant_menu.ID_CATEGORIE_MENU LEFT JOIN restaurant_sous_categorie_menu ON restaurant_sous_categorie_menu.ID_SOUS_CATEGORIE_MENU=restaurant_menu.ID_SOUS_CATEGORIE_MENU LEFT JOIN restaurant_sous_sous_categorie ON restaurant_sous_sous_categorie.ID_SOUS_SOUS_CATEGORIE=restaurant_menu.ID_SOUS_SOUS_CATEGORIE LEFT JOIN restaurant_repas ON restaurant_repas.ID_REPAS=restaurant_menu.ID_REPAS LEFT JOIN partenaires ON partenaires.ID_PARTENAIRE=restaurant_menu.ID_PARTENAIRE LEFT JOIN restaurant_menu_unite ON restaurant_menu_unite.ID_UNITE=restaurant_menu_taille.ID_UNITE LEFT JOIN  restaurant_menu_prix ON  restaurant_menu_prix.ID_RESTAURANT_MENU=restaurant_menu.ID_RESTAURANT_MENU WHERE ID_MENU_QUANTITE=?", [id]);
        return query("SELECT * FROM restaurant_menu_taille rs_menu LEFT JOIN restaurant_menu ON restaurant_menu.ID_MENU_QUANTITE=rs_menu.ID_MENU_QUANTITE LEFT JOIN restaurant_categorie_menu ON restaurant_categorie_menu.ID_CATEGORIE_MENU=restaurant_menu.ID_CATEGORIE_MENU LEFT JOIN restaurant_sous_categorie_menu ON restaurant_sous_categorie_menu.ID_SOUS_CATEGORIE_MENU=restaurant_menu.ID_SOUS_CATEGORIE_MENU LEFT JOIN restaurant_sous_sous_categorie ON restaurant_sous_sous_categorie.ID_SOUS_SOUS_CATEGORIE=restaurant_menu.ID_SOUS_SOUS_CATEGORIE LEFT JOIN restaurant_repas ON restaurant_repas.ID_REPAS=restaurant_menu.ID_REPAS LEFT JOIN partenaires ON partenaires.ID_PARTENAIRE=restaurant_menu.ID_PARTENAIRE LEFT JOIN restaurant_menu_unite ON restaurant_menu_unite.ID_UNITE=rs_menu.ID_UNITE LEFT JOIN  restaurant_menu_prix ON  restaurant_menu_prix.ID_RESTAURANT_MENU=restaurant_menu.ID_RESTAURANT_MENU WHERE rs_menu.ID_MENU_QUANTITE=?", [id]);
        // return query("SELECT * FROM restaurant_menu_taille rs_menu LEFT JOIN restaurant_menu ON restaurant_menu.ID_MENU_QUANTITE=rs_menu.ID_MENU_QUANTITE LEFT JOIN restaurant_menu_prix ON restaurant_menu_prix.ID_RESTAURANT_MENU=restaurant_menu.ID_RESTAURANT_MENU WHERE rs_menu.ID_MENU_QUANTITE=?", [id]);
    } catch (error) {
        throw error;
    }
};

const findAllRepas = async () => {
    try {
        return query("SELECT ID_REPAS, DESCRIPTION FROM restaurant_repas WHERE 1");
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
    createRepas,
    createMenuTaille,
    createMenuPrix

}