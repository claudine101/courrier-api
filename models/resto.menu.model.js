const { query } = require("../utils/db");
const findmenucategories = async () => {
    try {

        return query("SELECT * FROM `restaurant_categorie_menu` WHERE 1");
    }
    catch (error) {
        throw error

    }
}
const findCategories = async (ID_PARTENAIRE_SERVICE) => {
    try {
        var binds = [ID_PARTENAIRE_SERVICE]
        var sqlQuery =" SELECT DISTINCT rcm.ID_CATEGORIE_MENU ,rcm.NOM FROM  restaurant_categorie_menu   rcm LEFT JOIN  restaurant_menus rm  "
        sqlQuery +=" ON rm.ID_CATEGORIE_MENU=rcm.ID_CATEGORIE_MENU WHERE rm.ID_PARTENAIRE_SERVICE= ? "
        return query(sqlQuery, [binds]);
    }
    catch (error) {
        throw error
    }
}
const findmenusouscategories = async (ID_CATEGORIE_MENU) => {
    try {
        return query("SELECT sou.ID_SOUS_CATEGORIE_MENU,sou.NOM,sou.DESCRIPTION  FROM  restaurant_sous_categorie_menu  sou  LEFT JOIN restaurant_categorie_menu cat ON cat.ID_CATEGORIE_MENU=sou.ID_CATEGORIE_MENU WHERE cat.ID_CATEGORIE_MENU=?", [ID_CATEGORIE_MENU]);
    }
    catch (error) {
        throw error
    }
}
const findmenu = async () => {
    try {
        var binds = [ID_USER, ID_PARTENAIRE_SERVICE]
        var sqlQuery = "SELECT  ps.ID_PARTENAIRE_SERVICE,ps.NOM_ORGANISATION,menu.DATE_INSERTION,menu.ID_RESTAURANT_MENU,menu.IMAGES_1,menu.IMAGES_2,menu.IMAGES_3 , rr.ID_REPAS,rr.NOM AS repas ,rr.DESCRIPTION,  " 
        sqlQuery += " menu.PRIX,c_menu.ID_CATEGORIE_MENU,c_menu.NOM as categorie,sc_menu.ID_SOUS_CATEGORIE_MENU  FROM restaurant_menus menu LEFT JOIN  "
        sqlQuery += "restaurant_categorie_menu c_menu ON menu.ID_CATEGORIE_MENU=c_menu.ID_CATEGORIE_MENU "
        sqlQuery += "LEFT JOIN  restaurant_sous_categorie_menu sc_menu ON  "
        sqlQuery += "sc_menu.ID_SOUS_CATEGORIE_MENU=menu.ID_SOUS_CATEGORIE_MENU LEFT JOIN partenaire_service ps ON  "
        sqlQuery += "ps.ID_PARTENAIRE_SERVICE=menu.ID_PARTENAIRE_SERVICE "
        sqlQuery += "LEFT JOIN partenaires p on p.ID_PARTENAIRE=ps.ID_PARTENAIRE "
        sqlQuery += "LEFT JOIN restaurant_repas rr ON rr.ID_REPAS=menu.ID_REPAS " 
        sqlQuery += "WHERE p.ID_USER=? AND ps.ID_PARTENAIRE_SERVICE=? ORDER BY menu.DATE_INSERTION DESC"
        return query(sqlQuery, [ID_USER, ID_PARTENAIRE_SERVICE]);
    }
    catch (error) {
        throw error
    }
}
const findByIDmenu = async (ID_PARTENAIRE_SERVICE,category,limit = 10, offset = 0) => {
    try {
        var binds = [ ID_PARTENAIRE_SERVICE]
        var sqlQuery = "SELECT  ps.ID_PARTENAIRE_SERVICE,ps.NOM_ORGANISATION,menu.DATE_INSERTION,menu.ID_RESTAURANT_MENU,menu.IMAGES_1,menu.IMAGES_2,menu.IMAGES_3 , rr.ID_REPAS,rr.NOM AS repas ,rr.DESCRIPTION,  " 
        sqlQuery += " menu.PRIX,c_menu.ID_CATEGORIE_MENU,c_menu.NOM as categorie,sc_menu.ID_SOUS_CATEGORIE_MENU  FROM restaurant_menus menu LEFT JOIN  "
        sqlQuery += "restaurant_categorie_menu c_menu ON menu.ID_CATEGORIE_MENU=c_menu.ID_CATEGORIE_MENU "
        sqlQuery += "LEFT JOIN  restaurant_sous_categorie_menu sc_menu ON  "
        sqlQuery += "sc_menu.ID_SOUS_CATEGORIE_MENU=menu.ID_SOUS_CATEGORIE_MENU LEFT JOIN partenaire_service ps ON  "
        sqlQuery += "ps.ID_PARTENAIRE_SERVICE=menu.ID_PARTENAIRE_SERVICE "
        sqlQuery += "LEFT JOIN partenaires p on p.ID_PARTENAIRE=ps.ID_PARTENAIRE "
        sqlQuery += "LEFT JOIN restaurant_repas rr ON rr.ID_REPAS=menu.ID_REPAS " 
        sqlQuery += "WHERE  ps.ID_PARTENAIRE_SERVICE=?"
        if (category) {
            sqlQuery += " AND  c_menu.ID_CATEGORIE_MENU=? "
            binds.push(category)
        }
        sqlQuery += `  ORDER BY menu.DATE_INSERTION DESC LIMIT ${offset}, ${limit}`;

        return query(sqlQuery, [ID_PARTENAIRE_SERVICE,category]);
    }
    catch (error) {
        throw error
    }
}
const findAllmenu = async (category, limit = 10, offset = 0) => {
    try {
        var binds = [category]
        var sqlQuery = "SELECT  ps.ID_PARTENAIRE_SERVICE,ps.NOM_ORGANISATION,menu.DATE_INSERTION,menu.ID_RESTAURANT_MENU,menu.IMAGES_1,menu.IMAGES_2,menu.IMAGES_3 , rr.ID_REPAS,rr.NOM AS repas ,rr.DESCRIPTION,  " 
        sqlQuery += " menu.PRIX,c_menu.ID_CATEGORIE_MENU,c_menu.NOM as categorie,sc_menu.ID_SOUS_CATEGORIE_MENU  FROM restaurant_menus menu LEFT JOIN  "
        sqlQuery += "restaurant_categorie_menu c_menu ON menu.ID_CATEGORIE_MENU=c_menu.ID_CATEGORIE_MENU "
        sqlQuery += "LEFT JOIN  restaurant_sous_categorie_menu sc_menu ON  "
        sqlQuery += "sc_menu.ID_SOUS_CATEGORIE_MENU=menu.ID_SOUS_CATEGORIE_MENU LEFT JOIN partenaire_service ps ON  "
        sqlQuery += "ps.ID_PARTENAIRE_SERVICE=menu.ID_PARTENAIRE_SERVICE "
        sqlQuery += "LEFT JOIN partenaires p on p.ID_PARTENAIRE=ps.ID_PARTENAIRE "
        sqlQuery += "LEFT JOIN restaurant_repas rr ON rr.ID_REPAS=menu.ID_REPAS " 
        if (category) {
            sqlQuery += " WHERE  c_menu.ID_CATEGORIE_MENU=? "
            binds.push(category)
        }
        sqlQuery += ` ORDER BY menu.DATE_INSERTION DESC LIMIT ${offset}, ${limit}`;

        return query(sqlQuery , binds);

    }
    catch (error) {
        throw error

    }
}
const findmenubyPartenaire = async (ID_PARTENAIRE) => {
    try {

        return query("SELECT rcm.NOM AS NOM_CATEGORIE,rscm.NOM AS NOM_SOUS_CATEGORIE,rscm.DESCRIPTION AS DESCRIPTION_SOUS_CATEGORIE,rm.IMAGES_1 AS IMAGE ,rpc.MONTANT, rm.ID_PARTENAIRE FROM restaurant_menu rm LEFT JOIN restaurant_sous_categorie_menu rscm ON rm.ID_SOUS_CATEGORIE_MENU=rscm.ID_SOUS_CATEGORIE_MENU LEFT JOIN restaurant_categorie_menu rcm ON rcm.ID_CATEGORIE_MENU=rm.ID_CATEGORIE_MENU LEFT JOIN restaurant_menu_prix rpc ON rpc.ID_RESTAURANT_MENU=rm.ID_RESTAURANT_MENU LEFT JOIN partenaires part ON part.ID_PARTENAIRE=rm.ID_PARTENAIRE WHERE 1 AND rm.ID_PARTENAIRE=?", [ID_PARTENAIRE]);
    }
    catch (error) {
        throw error

    }
}


module.exports = {
    findmenucategories,
    findmenusouscategories,
    findmenu,
    findAllmenu,
    findmenubyPartenaire,
    findCategories,
    findByIDmenu

}