const { query } = require("../utils/db");
const findmenucategories = async () => {
    try {

        return query("SELECT * FROM `restaurant_categorie_menu` WHERE 1");
    }
    catch (error) {
        throw error

    }
}
const findmenusouscategories = async (ID_CATEGORIE_MENU) => {
    try {

        return query("SELECT rsc.ID_SOUS_CATEGORIE_MENU,rsc.NOM As NOM_SOUS_CATEGORIE,rsc.DESCRIPTION,rc.NOM AS NOM_CATEGORIE FROM restaurant_sous_categorie_menu rsc LEFT JOIN restaurant_categorie_menu rc ON rsc.ID_CATEGORIE_MENU=rc.ID_CATEGORIE_MENU WHERE 1 AND rc.ID_CATEGORIE_MENU=?",[ID_CATEGORIE_MENU]);
    }
    catch (error) {
        throw error

    }
}
const findmenu =async (ID_SOUS_CATEGORIE_MENU) => {
    try {

        return query("SELECT rcm.NOM AS NOM_CATEGORIE,rscm.NOM AS NOM_SOUS_CATEGORIE,rscm.DESCRIPTION AS DESCRIPTION_SOUS_CATEGORIE,rmd.TAILLE,rm.IMAGES_1 AS IMAGE ,rmu.UNITES_MESURES,rpc.MONTANT FROM restaurant_menu rm LEFT JOIN restaurant_sous_categorie_menu rscm ON rm.ID_SOUS_CATEGORIE_MENU=rscm.ID_SOUS_CATEGORIE_MENU LEFT JOIN restaurant_categorie_menu rcm ON rcm.ID_CATEGORIE_MENU=rm.ID_CATEGORIE_MENU LEFT JOIN restaurant_menu_details rmd ON rmd.ID_MENU_DETAIL=rm.ID_MENU_DETAIL LEFT JOIN restaurant_menu_unite rmu ON rmu.ID_UNITE=rmd.ID_UNITE LEFT JOIN restaurant_prix_categorie rpc ON rpc.ID_RESTAURANT_MENU=rm.ID_CATEGORIE_MENU WHERE 1 AND rscm.ID_SOUS_CATEGORIE_MENU=?",[ID_SOUS_CATEGORIE_MENU]);
    }
    catch (error) {
        throw error

    }
}

module.exports = {
    findmenucategories,
    findmenusouscategories,
    findmenu
}