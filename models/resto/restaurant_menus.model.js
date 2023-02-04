const { query } = require("../../utils/db");

const findAllmenu = async (q, category, subCategory, partenaireService, limit = 10, offset = 0,userId ,min_prix, max_prix) => {
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
                          WHERE 1
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
const findwishlistmenu = async ( limit = 10, offset = 0,userId) => {
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
const createwishlist = async (ID_RESTAURANT_MENU,ID_USER,id) => {
        try {
                  var sqlQuery = `
                  INSERT INTO   restaurant_wishlist_menu(ID_RESTAURANT_MENU,ID_USER)
                  VALUES (?,?)
                  `
                  return query(sqlQuery, [ID_RESTAURANT_MENU,ID_USER,id])
        }
        catch (error) {
                  throw error
        }
    }

module.exports = {
          findAllmenu,
          createMenu,
          createwishlist,
          findwishlistmenu
}