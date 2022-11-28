const { query } = require("../utils/db");

const createUser = (NOM, PRENOM, EMAIL, USERNAME, PASSWORD, ID_PROFIL, SEXE, DATE_NAISSANCE, COUNTRY_ID, ADRESSE, TELEPHONE_1, TELEPHONE_2, IMAGE) => {
          try {
                    var sqlQuery = "INSERT INTO users (NOM,PRENOM,EMAIL,USERNAME,PASSWORD,ID_PROFIL,SEXE,DATE_NAISSANCE,COUNTRY_ID,ADRESSE,TELEPHONE_1,TELEPHONE_2,IMAGE)";
                    sqlQuery += "values (?,?,?,?,?,?,?,?,?,?,?,?,?)";
                    return query(sqlQuery, [
                              NOM, PRENOM, EMAIL, USERNAME, PASSWORD, ID_PROFIL, SEXE, DATE_NAISSANCE, COUNTRY_ID, ADRESSE, TELEPHONE_1, TELEPHONE_2, IMAGE])
          }
          catch (error) {

                    throw error
          }
}
const createPartenaire = (ID_USER, ID_TYPE_PARTENAIRE, NOM_ORGANISATION) => {
          try {
                    var sqlQuery = "INSERT INTO partenaires (ID_USER,ID_TYPE_PARTENAIRE,NOM_ORGANISATION)";
                    sqlQuery += "values (?,?,?)";
                    return query(sqlQuery, [
                              ID_USER, ID_TYPE_PARTENAIRE, NOM_ORGANISATION])
          }
          catch (error) {

                    throw error
          }
}
const createService = (ID_PARTENAIRE, ID_SERVICE, PARTENAIRE_SERVICE_STATUT_ID) => {
          try {
                    var sqlQuery = "INSERT INTO partenaire_service (ID_PARTENAIRE,ID_SERVICE,PARTENAIRE_SERVICE_STATUT_ID)";
                    sqlQuery += "values (?,?,?)";
                    return query(sqlQuery, [ID_PARTENAIRE, ID_SERVICE, PARTENAIRE_SERVICE_STATUT_ID])
          }
          catch (error) {

                    throw error
          }

}
const findById = async (id) => {
          try {
                    return query("SELECT * FROM   users u  LEFT JOIN partenaires p ON u.ID_USER=p.ID_USER LEFT JOIN partenaire_service pa on pa.ID_PARTENAIRE=p.ID_PARTENAIRE WHERE u.ID_USER= ?", [id]);
          } catch (error) {
                    throw error;
          }
};
const findNote = async (ID_PARTENAIRE_SERVICE) => {
    try {
        var sqlQuery = "SELECT COUNT (*) AS nbre FROM  partenaire_service_note WHERE ID_PARTENAIRE_SRVICE=?";
        return query(sqlQuery, [ID_PARTENAIRE_SERVICE]) 
    } catch (error) {
              throw error;
    }
};
const findByIdPartenaire = async (id) => {
          try {
                    return query("SELECT * FROM   users u  LEFT JOIN partenaires p ON u.ID_USER=p.ID_USER LEFT JOIN partenaire_service pa on pa.ID_PARTENAIRE=p.ID_PARTENAIRE WHERE u.ID_USER= ?", [id]);

          } catch (error) {
                    throw error;
          }
};
const findByService = async (ID_SERVICE) => {
          try {
                    var sqlQuery = "SELECT * FROM partenaire_service ps"
                    sqlQuery += " WHERE ps.ID_SERVICE AND ps.ID_TYPE_PARTENAIRE = 2 "
                    return query(sqlQuery, [ID_SERVICE]);
          }
          catch (error) {
                    throw error;
          }
};
module.exports = {
          createUser,
          createPartenaire,
          createService,
          findById,
          findByIdPartenaire,
          findByService,
          findNote

}