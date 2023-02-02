const { query } = require("../../utils/db");

/**
 * Permet d'enregistre un utilisateur comme partenaire
 * @param { Number } ID_USER - l'ID utilisateur à enregistrer
 */
const createOnePartenaire = (ID_USER) => {
          try {
                    var sqlQuery = "INSERT INTO partenaires (ID_USER)";
                    sqlQuery += "values (?)";
                    return query(sqlQuery, [ID_USER])
          }
          catch (error) {

                    throw error
          }
}

module.exports = {
          createOnePartenaire
}