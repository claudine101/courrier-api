const { query } = require("../../utils/db");

const findAllmenu = async (q, category, subCategory, partenaireService, limit = 10, offset = 0, userId, min_prix, max_prix) => {
        try {
                var binds = [userId]
                var sqlQuery = `
                                  SELECT menu.*,
                                  ps.NOM_ORGANISATION,
                                  ps.ID_TYPE_PARTENAIRE,
                                  ps.ID_PARTENAIRE,
                                  ps.ID_PARTENAIRE_SERVICE,
                                  ps.ADRESSE_COMPLETE,
                                  ps.ID_SERVICE,
                                  ps.LOGO,
                                  ps.BACKGROUND_IMAGE,
                                  ps.EMAIL,
                                  ps.TELEPHONE,
                                  resc.NOM NOM_CATEGORIE,
                                  rwm.ID_WISHLIST
                          FROM restaurant_menus menu
                                  LEFT JOIN partenaire_service ps ON ps.ID_PARTENAIRE_SERVICE = menu.ID_PARTENAIRE_SERVICE
                                  LEFT JOIN partenaires par ON par.ID_PARTENAIRE = ps.ID_PARTENAIRE
                                  LEFT JOIN restaurant_categorie_menu resc ON resc.ID_CATEGORIE_MENU = menu.ID_CATEGORIE_MENU
                                  LEFT JOIN restaurant_wishlist_menu rwm ON rwm.ID_RESTAURANT_MENU=menu.ID_RESTAURANT_MENU AND rwm.ID_USER=?
                          WHERE menu.DATE_SUPPRESSION IS NULL
                          `
                if (q && q != "") {
                        sqlQuery +=
                                "AND  menu.NOM  LIKE ?";
                        binds.push(`%${q}%`);
                }
                if (category) {
                        sqlQuery += " AND menu.ID_CATEGORIE_MENU=? "
                        binds.push(category)
                }
                if (partenaireService) {
                        sqlQuery += " AND menu.ID_PARTENAIRE_SERVICE = ? "
                        binds.push(partenaireService)
                }
                if (min_prix && !max_prix) {
                        sqlQuery += " AND menu.PRIX >=? "
                        binds.push(min_prix)
                }
                else if (!min_prix && max_prix) {
                        sqlQuery += " AND menu.PRIX <=? "
                        binds.push(max_prix)
                }
                else if (min_prix && max_prix) {
                        sqlQuery += "AND menu.PRIX BETWEEN min_prix=? AND max_prix=?"
                        binds.push(min_prix && max_prix)

                }
                sqlQuery += ` ORDER BY menu.DATE_INSERTION DESC LIMIT ${offset}, ${limit}`;
                return query(sqlQuery, binds);
        }
        catch (error) {
                throw error

        }
}
const findNotes = async (ID_RESTAURANT_MENU, limit = 10, offset = 0,) => {
        try {
                var binds = [ID_RESTAURANT_MENU]
                var sqlQuery = `
                  SELECT rmn.NOTE,rmn.COMMENTAIRE,u.NOM,u.PRENOM,rmn.DATE_INSERTION FROM restaurant_menus_notes rmn 
                  LEFT JOIN users u ON rmn.ID_USER=u.ID_USER WHERE 1 AND rmn.ID_RESTAURANT_MENU=?
                  `
                sqlQuery += ` ORDER BY rmn.DATE_INSERTION DESC LIMIT ${offset}, ${limit}`;
                return query(sqlQuery, binds)
        } catch (error) {
                throw error
        }
}
const finduserNotes = async (ID_RESTAURANT_MENU) => {
        try {
                var binds = [ID_RESTAURANT_MENU]
                var sqlQuery = `
                SELECT rmn.ID_NOTE,rmn.NOTE,rmn.ID_USER,rmn.COMMENTAIRE,u.NOM,u.PRENOM,rmn.DATE_INSERTION FROM restaurant_menus_notes rmn LEFT 
                JOIN users u ON rmn.ID_USER=u.ID_USER WHERE 1 AND rmn.ID_RESTAURANT_MENU=?
                  `

                return query(sqlQuery, binds)
        } catch (error) {
                throw error
        }
}
const changeNote = async (NOTE, COMMENTAIRE, ID_NOTE) => {

        try {

                var sqlQuery = `UPDATE  restaurant_menus_notes SET NOTE=?,COMMENTAIRE=? WHERE ID_NOTE=?`
                return query(sqlQuery, [NOTE, COMMENTAIRE, ID_NOTE])
        } catch (error) {
                throw error
        }
}
const findwishlistmenu = async (limit = 10, offset = 0, userId) => {
        try {
                var binds = [userId]
                var sqlQuery = `
                                SELECT menu.*,
                                ps.NOM_ORGANISATION,
                                ps.ID_TYPE_PARTENAIRE,
                                ps.ID_PARTENAIRE,
                                ps.ID_PARTENAIRE_SERVICE,
                                ps.ADRESSE_COMPLETE,
                                ps.ID_SERVICE,
                                ps.LOGO,
                                ps.BACKGROUND_IMAGE,
                                ps.EMAIL,
                                ps.TELEPHONE,
                                resc.NOM NOM_CATEGORIE,
                                rwm.ID_WISHLIST
                        FROM restaurant_menus menu
                                LEFT JOIN partenaire_service ps ON ps.ID_PARTENAIRE_SERVICE = menu.ID_PARTENAIRE_SERVICE
                                LEFT JOIN partenaires par ON par.ID_PARTENAIRE = ps.ID_PARTENAIRE
                                LEFT JOIN restaurant_categorie_menu resc ON resc.ID_CATEGORIE_MENU = menu.ID_CATEGORIE_MENU
                                LEFT JOIN restaurant_wishlist_menu rwm ON rwm.ID_RESTAURANT_MENU=menu.ID_RESTAURANT_MENU 
                        WHERE 1 AND  rwm.ID_USER=?
                        `

                sqlQuery += ` ORDER BY menu.DATE_INSERTION DESC LIMIT ${offset}, ${limit}`;
                return query(sqlQuery, binds);
        }
        catch (error) {
                throw error

        }
}
const createMenu = (ID_CATEGORIE_MENU, ID_PARTENAIRE_SERVICE, PRIX, NOM, DESCRIPTION, IMAGE_1, IMAGE_2, IMAGE_3) => {
        try {
                var sqlQuery = "INSERT INTO restaurant_menus (ID_CATEGORIE_MENU, ID_PARTENAIRE_SERVICE,PRIX,NOM,DESCRIPTION,IMAGE_1,IMAGE_2,IMAGE_3)";
                sqlQuery += "values (?,?,?,?,?,?,?,?)";
                return query(sqlQuery, [ID_CATEGORIE_MENU, ID_PARTENAIRE_SERVICE, PRIX, NOM, DESCRIPTION, IMAGE_1, IMAGE_2, IMAGE_3])
        } catch (error) {
                throw error
        }
};
const createnotes = async (ID_USER, ID_RESTAURANT_MENU, NOTE, COMMENTAIRE) => {
        try {
                var sqlQuery = `
                  INSERT INTO  restaurant_menus_notes(ID_USER,ID_RESTAURANT_MENU,NOTE,COMMENTAIRE)
                  VALUES (?,?,?,?)
                  `
                return query(sqlQuery, [ID_USER, ID_RESTAURANT_MENU, NOTE, COMMENTAIRE])
        } catch (error) {
                throw error
        }
}
const createwishlist = async (ID_RESTAURANT_MENU, ID_USER, id) => {
        try {
                var sqlQuery = `
                  INSERT INTO   restaurant_wishlist_menu(ID_RESTAURANT_MENU,ID_USER)
                  VALUES (?,?)
                  `
                return query(sqlQuery, [ID_RESTAURANT_MENU, ID_USER, id])
        }
        catch (error) {
                throw error
        }
}

    const updateMenu = (ID_CATEGORIE_MENU, ID_PARTENAIRE_SERVICE, PRIX, NOM, DESCRIPTION, IMAGE_1, IMAGE_2, IMAGE_3,ID_RESTAURANT_MENU) => {
        try {
                  var sqlQuery = "UPDATE restaurant_menus SET ID_CATEGORIE_MENU=?, ID_PARTENAIRE_SERVICE=?,PRIX=?,NOM=?,DESCRIPTION=?,IMAGE_1=?,IMAGE_2=?,IMAGE_3=? WHERE ID_RESTAURANT_MENU=?";
                  return query(sqlQuery, [ID_CATEGORIE_MENU, ID_PARTENAIRE_SERVICE, PRIX, NOM, DESCRIPTION, IMAGE_1, IMAGE_2, IMAGE_3,ID_RESTAURANT_MENU])
        } catch (error) {
                  throw error
        }
};

module.exports = {
        findAllmenu,
        createMenu,
        createwishlist,
        findwishlistmenu,
        createnotes,
        findNotes,
        finduserNotes,
        changeNote,
          updateMenu
}