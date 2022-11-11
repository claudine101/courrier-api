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

        return query("SELECT sou.ID_SOUS_CATEGORIE_MENU,sou.NOM,sou.DESCRIPTION  FROM  restaurant_sous_categorie_menu  sou  LEFT JOIN restaurant_categorie_menu cat ON cat.ID_CATEGORIE_MENU=sou.ID_CATEGORIE_MENU WHERE cat.ID_CATEGORIE_MENU=?", [ID_CATEGORIE_MENU]);
    }
    catch (error) {
        throw error

    }
}
const findById = async (id) => {
    try {
        var sqlQuery = "SELECT epn.ID_NOTE, epn.NOTE,epn.COMMENTAIRE,ID_RESTAURANT_MENU,u.NOM,u.PRENOM, epn.ID_USER,epn.DATE_INSERTION,u.IMAGE FROM restaurant_menus_notes epn LEFT JOIN users u ON epn.ID_USER=u.ID_USER   WHERE epn.ID_NOTE=?";
        return query(sqlQuery, [id]);

    }
    catch (error) {
        throw error
    }
}

const createNotes = (ID_USER,ID_RESTAURANT_MENU,NOTE,COMMENTAIRE) => {
    try {
      var sqlQuery = "INSERT INTO restaurant_menus_notes (ID_USER,ID_RESTAURANT_MENU,NOTE,COMMENTAIRE)";
     // console.log(ID_USER,ID_PRODUIT_PARTENAIRE,NOTE,COMMENTAIRE)
      sqlQuery += "values (?,?,?,?)";
      return query(sqlQuery, [
        ID_USER,ID_RESTAURANT_MENU,NOTE,COMMENTAIRE])
    }
    catch (error) {
  
      throw error
    }
  }


const findmenu = async (ID_CATEGORIE_MENU, ID_PARTENAIRE) => {
    try {
        var binds = []
        var sqlQuery = "SELECT * FROM restaurant_menus menu LEFT JOIN  "
        sqlQuery += "restaurant_categorie_menu c_menu ON menu.ID_CATEGORIE_MENU=c_menu.ID_CATEGORIE_MENU "
        sqlQuery += "LEFT JOIN  restaurant_sous_categorie_menu sc_menu ON  "
        sqlQuery += "sc_menu.ID_SOUS_CATEGORIE_MENU=menu.ID_SOUS_CATEGORIE_MENU "
        return query(sqlQuery, [binds]);

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
    findmenubyPartenaire,
    createNotes,
    findById

}