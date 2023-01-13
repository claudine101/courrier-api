const { query } = require("../utils/db");

//RECUPERATION DE TOUS LES SERICES
const findAll = async (value) => {
          try {

                    var sqlQuery = "SELECT * FROM services s LEFT JOIN categories_service ca ON s.ID_CATEGORIE_SERVICE=ca.ID_CATEGORIE_SERVICE WHERE 1 "
                    return query(sqlQuery, [value]);
          }
          catch (error) {
                    console.log(error)
                    throw error
          }

}
const updateImage = async (IMAGE,ID_PARTENAIRE_SERVICE) =>{
    try {
      var sqlQuery = `UPDATE  partenaire_service SET LOGO = ? ,BACKGROUND_IMAGE=? WHERE ID_PARTENAIRE_SERVICE = ?`;
      return query(sqlQuery, [
        IMAGE,
        IMAGE,
        ID_PARTENAIRE_SERVICE
      ]);
    } catch (error) {
      throw error;
    }
   }
const findById = async (ID_USER, ID_SERVICE) => {
          try {

                    var sqlQuery = "SELECT * FROM partenaires par LEFT JOIN "
                    sqlQuery += " partenaire_service ser ON ser.ID_PARTENAIRE=par.ID_PARTENAIRE  "
                    sqlQuery += " LEFT JOIN  services srv on srv.ID_SERVICE=ser.ID_SERVICE "
                    sqlQuery += " WHERE par.ID_USER=? AND srv.ID_SERVICE=? "
                    return query(sqlQuery, [ID_USER, ID_SERVICE]);
          }
          catch (error) {
                    console.log(error)
                    throw error
          }

}

/**
 * Permet de récuperer les services du partenaire qlq
 * @param { Number } idPartenaire L'id du partenaire
 * @returns 
 */
const findPartenaireServices = async (idPartenaire) => {
          try {
                    var sqlQuery = " SELECT * FROM partenaire_service WHERE ID_PARTENAIRE = ?"
                    return query(sqlQuery, [idPartenaire]);
          }catch (error) {
                    throw error
          }

}
const createOne = async (ID_PARTENAIRE_SERVICE, ID_SERVICE, MODE_ID = 1, NUMERO, TXNI_D,) => {
          try {
                    return query('INSERT INTO service_payement(ID_PARTENAIRE_SERVICE,ID_SERVICE, MODE_ID, NUMERO,  TXNI_D)VALUES(?, ?, ?, ?, ?)', [
                              ID_PARTENAIRE_SERVICE, ID_SERVICE, MODE_ID = 1, NUMERO, TXNI_D,])
          } catch (error) {
                    throw error
          }
}
module.exports = {
          createOne,
          findAll,
          findById,
          findPartenaireServices
}



