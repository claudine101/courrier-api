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
        var sqlQuery = " SELECT DISTINCT rcm.ID_CATEGORIE_MENU ,rcm.NOM ,rcm.IMAGE FROM  restaurant_categorie_menu   rcm LEFT JOIN  restaurant_menus rm  "
        sqlQuery += " ON rm.ID_CATEGORIE_MENU=rcm.ID_CATEGORIE_MENU WHERE rm.ID_PARTENAIRE_SERVICE= ? "
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




const findById = async (id) => {
    try {
        var sqlQuery = "SELECT epn.ID_NOTE,epn.NOTE,epn.COMMENTAIRE,epn.ID_RESTAURANT_MENU,u.NOM,u.PRENOM, epn.ID_USER,epn.DATE_INSERTION,u.IMAGE FROM restaurant_menus_notes epn LEFT JOIN users u ON epn.ID_USER=u.ID_USER   WHERE epn.ID_NOTE=?";
        return query(sqlQuery, [id]);

    }
    catch (error) {
        throw error
    }
}
const createNotes = (ID_USER, ID_RESTAURANT_MENU, NOTE, COMMENTAIRE) => {
    try {
        var sqlQuery = "INSERT INTO restaurant_menus_notes (ID_USER,ID_RESTAURANT_MENU,NOTE,COMMENTAIRE)";
        sqlQuery += "values (?,?,?,?)";
        return query(sqlQuery, [
            ID_USER, ID_RESTAURANT_MENU, NOTE, COMMENTAIRE])
    }
    catch (error) {
        throw error
    }
}
const findBYidProduitPartenaire = async (id, limit = 10, offset = 0) => {
    try {
        var sqlQuery = "SELECT epn.NOTE,epn.COMMENTAIRE,epn.ID_RESTAURANT_MENU,u.NOM,u.PRENOM,"
        sqlQuery += " epn.ID_USER,epn.DATE_INSERTION,u.IMAGE FROM restaurant_menus_notes epn LEFT JOIN"
        sqlQuery += " users u ON epn.ID_USER=u.ID_USER   WHERE epn.ID_RESTAURANT_MENU=?"
        sqlQuery += ` ORDER BY epn.DATE_INSERTION DESC LIMIT ${offset}, ${limit}`;
        return query(sqlQuery, [id]);

    }
    catch (error) {
        throw error
    }
}
const findmenu = async (ID_USER, ID_PARTENAIRE_SERVICE) => {

    try {
        var binds = [ID_USER, ID_PARTENAIRE_SERVICE]
       
    var sqlQuery = `
    SELECT ps.ID_PARTENAIRE_SERVICE,
    ps.NOM_ORGANISATION,
    menu.DATE_INSERTION,
    menu.ID_RESTAURANT_MENU,
    menu.IMAGE_1,
    menu.IMAGE_2,
    menu.IMAGE_3,
    rr.ID_REPAS,
    rr.NOM AS repas,
    menu.DESCRIPTION,
    menu.TEMPS_PREPARATION,
    menu.PRIX,
    c_menu.ID_CATEGORIE_MENU,
    c_menu.NOM as categorie,
    sc_menu.ID_SOUS_CATEGORIE_MENU
FROM restaurant_menus menu
    LEFT JOIN restaurant_categorie_menu c_menu ON menu.ID_CATEGORIE_MENU = c_menu.ID_CATEGORIE_MENU
    LEFT JOIN restaurant_sous_categorie_menu sc_menu ON sc_menu.ID_SOUS_CATEGORIE_MENU = menu.ID_SOUS_CATEGORIE_MENU
    LEFT JOIN partenaire_service ps ON ps.ID_PARTENAIRE_SERVICE = menu.ID_PARTENAIRE_SERVICE
    LEFT JOIN partenaires p on p.ID_PARTENAIRE = ps.ID_PARTENAIRE
    LEFT JOIN restaurant_repas rr ON rr.ID_REPAS = menu.ID_REPAS
WHERE p.ID_USER = ?
    AND ps.ID_PARTENAIRE_SERVICE = ?
ORDER BY menu.DATE_INSERTION DESC`
        return query(sqlQuery, [ID_USER, ID_PARTENAIRE_SERVICE]);
    }
    catch (error) {
        throw error
    }
}
const findByIDmenu = async (ID_PARTENAIRE_SERVICE, category, limit = 10, offset = 0) => {
    try {
        var binds = [ID_PARTENAIRE_SERVICE]
        var sqlQuery = "SELECT ps.OUVERT,ps.PRESENTATION, ps.ADRESSE_COMPLETE,ps.TELEPHONE,ps.ID_PARTENAIRE_SERVICE, ps.LOGO,ps.NOM_ORGANISATION,menu.DATE_INSERTION,menu.ID_RESTAURANT_MENU,menu.IMAGES_1,menu.IMAGES_2,menu.IMAGES_3 , rr.ID_REPAS,rr.NOM AS repas ,rr.DESCRIPTION,  "
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

        return query(sqlQuery, [ID_PARTENAIRE_SERVICE, category]);
    }
    catch (error) {
        throw error
    }
}
const findAllmenu = async (q, category, limit = 10, offset = 0) => {
    try {
        var binds = []
        var sqlQuery = "SELECT  ps.ID_PARTENAIRE_SERVICE,ps.NOM_ORGANISATION,menu.DATE_INSERTION,menu.ID_RESTAURANT_MENU,menu.IMAGE_1,menu.IMAGE_2,menu.IMAGE_3 , rr.ID_REPAS,rr.NOM AS repas ,rr.DESCRIPTION,  "
        sqlQuery += " menu.PRIX,c_menu.ID_CATEGORIE_MENU,c_menu.NOM as categorie,sc_menu.ID_SOUS_CATEGORIE_MENU  FROM restaurant_menus menu LEFT JOIN  "
        sqlQuery += "restaurant_categorie_menu c_menu ON menu.ID_CATEGORIE_MENU=c_menu.ID_CATEGORIE_MENU "
        sqlQuery += "LEFT JOIN  restaurant_sous_categorie_menu sc_menu ON  "
        sqlQuery += "sc_menu.ID_SOUS_CATEGORIE_MENU=menu.ID_SOUS_CATEGORIE_MENU LEFT JOIN partenaire_service ps ON  "
        sqlQuery += "ps.ID_PARTENAIRE_SERVICE=menu.ID_PARTENAIRE_SERVICE "
        sqlQuery += "LEFT JOIN partenaires p on p.ID_PARTENAIRE=ps.ID_PARTENAIRE "
        sqlQuery += "LEFT JOIN restaurant_repas rr ON rr.ID_REPAS=menu.ID_REPAS "

        if (category) {
            binds.push(category)
            if (q && q != "") {
                sqlQuery += " WHERE  c_menu.ID_CATEGORIE_MENU=? "
                sqlQuery += ` AND rr.NOM LIKE '%${q}%'`

            }
            else {
                sqlQuery += " WHERE  c_menu.ID_CATEGORIE_MENU=? "
            }
        }
        else {
            if (q && q != "") {
                sqlQuery += `WHERE  rr.NOM LIKE '%${q}%' `
            }
        }
        sqlQuery += ` ORDER BY menu.DATE_INSERTION DESC LIMIT ${offset}, ${limit}`;
        return query(sqlQuery, binds);
    }
    catch (error) {
        throw error
    }
}
const findmenuResearch = async (q, category, limit = 10, offset = 0) => {
    try {
        var binds = []
        var sqlQuery = "SELECT  ps.ID_PARTENAIRE_SERVICE,ps.NOM_ORGANISATION,menu.DATE_INSERTION,menu.ID_RESTAURANT_MENU,menu.IMAGES_1,menu.IMAGES_2,menu.IMAGES_3 , rr.ID_REPAS,rr.NOM AS repas ,rr.DESCRIPTION,  "
        sqlQuery += " menu.PRIX,c_menu.ID_CATEGORIE_MENU,c_menu.NOM as categorie,sc_menu.ID_SOUS_CATEGORIE_MENU  FROM restaurant_menus menu LEFT JOIN  "
        sqlQuery += "restaurant_categorie_menu c_menu ON menu.ID_CATEGORIE_MENU=c_menu.ID_CATEGORIE_MENU "
        sqlQuery += "LEFT JOIN  restaurant_sous_categorie_menu sc_menu ON  "
        sqlQuery += "sc_menu.ID_SOUS_CATEGORIE_MENU=menu.ID_SOUS_CATEGORIE_MENU LEFT JOIN partenaire_service ps ON  "
        sqlQuery += "ps.ID_PARTENAIRE_SERVICE=menu.ID_PARTENAIRE_SERVICE "
        sqlQuery += "LEFT JOIN partenaires p on p.ID_PARTENAIRE=ps.ID_PARTENAIRE "
        sqlQuery += "LEFT JOIN restaurant_repas rr ON rr.ID_REPAS=menu.ID_REPAS "
        if (q && q != "") {
            sqlQuery += " WHERE  rr.NOM  LIKE  ?"
            binds.push(`%${q}%`)
        }
        if (category) {
            sqlQuery += " WHERE  c_menu.ID_CATEGORIE_MENU=? "
            binds.push(category)
        }
        sqlQuery += ` ORDER BY menu.DATE_INSERTION DESC LIMIT ${offset}, ${limit}`;

        return query(sqlQuery, binds);

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
const findWishlist = async (ID_USER, category, limit = 10, offset = 0) => {
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
        sqlQuery += " LEFT JOIN restaurant_wishlist_menu wi ON "
        sqlQuery += " wi.ID_RESTAURANT_MENU=menu.ID_RESTAURANT_MENU "
        sqlQuery += " WHERE 1  AND wi.ID_USERS=? "
        if (category) {
            sqlQuery += " AND  c_menu.ID_CATEGORIE_MENU=? "
            binds.push(category)
        }
        sqlQuery += ` ORDER BY menu.DATE_INSERTION DESC LIMIT ${offset}, ${limit}`;
        return query(sqlQuery, [ID_USER, category]);

    }
    catch (error) {
        throw error

    }
}
const findnotemenu = async (ID_RESTAURANT_MENU, id) => {
    try {
        var sqlQuery = "SELECT epn.NOTE,epn.COMMENTAIRE,epn.ID_RESTAURANT_MENU,u.NOM,u.PRENOM,"
        sqlQuery += " epn.ID_USER,epn.DATE_INSERTION,u.IMAGE FROM restaurant_menus_notes epn LEFT JOIN"
        sqlQuery += " users u ON epn.ID_USER=u.ID_USER   WHERE epn.ID_RESTAURANT_MENU=? AND  epn.ID_USER=?"
        //sqlQuery+=` ORDER BY epn.DATE_INSERTION DESC LIMIT ${offset}, ${limit}`;
        return query(sqlQuery, [ID_RESTAURANT_MENU, id]);

    }
    catch (error) {
        throw error
    }
}

const updateMenu = async (IMAGES_1, ID_RESTAURANT_MENU) => {
    try {
        var sqlQuery = "UPDATE  restaurant_menus SET IMAGES_1 = ? WHERE ID_RESTAURANT_MENU = ?";
        return query(sqlQuery, [
            IMAGES_1,
            ID_RESTAURANT_MENU
        ]);
    } catch (error) {
        throw error;
    }
}

const findMenuPartenaire = async (ID_PARTENAIRE_SERVICE, limit = 10, offset = 0, category, subCategory) => {
    try {
              var binds = [ID_PARTENAIRE_SERVICE]
              var sqlQuery = `
              SELECT res.*,
                        part_s.NOM_ORGANISATION,
                        part_s.TELEPHONE,
                        part_s.EMAIL,
                        part_s.LOGO,
                        res_menu.NOM AS NOM_CATEGORIE
                FROM restaurant_menus res
                        LEFT JOIN partenaire_service part_s ON part_s.ID_PARTENAIRE_SERVICE = res.ID_PARTENAIRE_SERVICE
                        LEFT JOIN restaurant_categorie_menu res_menu ON res_menu.ID_CATEGORIE_MENU = res.ID_CATEGORIE_MENU
                WHERE res.ID_PARTENAIRE_SERVICE = 2
                            `
              if(category) {
                        sqlQuery += " AND res.ID_CATEGORIE_MENU = ? "
                        binds.push(category)
              }
              sqlQuery += " ORDER BY res.DATE_INSERTION DESC "
              sqlQuery += `LIMIT ${offset}, ${limit}`;
              return query(sqlQuery, binds);
    } catch (error) {
              throw error
    }
}

const findByServiceMenus = async (ID_PARTENAIRE_SERVICE) => {
    try {
              var binds = [ID_PARTENAIRE_SERVICE]
              var sqlQuery = " SELECT ep.ID_RESTAURANT_MENU, COUNT(ep.ID_PARTENAIRE_SERVICE) AS NBRE_MENUS FROM restaurant_menus ep"
              sqlQuery += " LEFT JOIN partenaire_service ps ON ps.ID_PARTENAIRE_SERVICE=ep.ID_PARTENAIRE_SERVICE"
              sqlQuery += "  WHERE ep.ID_PARTENAIRE_SERVICE= ? GROUP BY ep.ID_PARTENAIRE_SERVICE "
              return query(sqlQuery, binds);

    }
    catch (error) {
              throw error

    }
}




module.exports = {
    findmenucategories,
    findmenusouscategories,
    findmenu,
    findmenuResearch,
    findAllmenu,
    findmenubyPartenaire,
    findCategories,
    findByIDmenu,
    findWishlist,
    createNotes,
    findById,
    findBYidProduitPartenaire,
    findnotemenu,
    updateMenu,
    findMenuPartenaire,
    findByServiceMenus


}