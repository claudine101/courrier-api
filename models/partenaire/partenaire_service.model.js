const { query } = require("../../utils/db");

const createPartenaireService = (ID_PARTENAIRE, ID_SERVICE, ID_TYPE_PARTENAIRE, NOM_ORGANISATION, TELEPHONE, NIF, EMAIL, LOGO, BACKGROUND_IMAGE, ADRESSE_COMPLETE, LATITUDE, LONGITUDE, PARTENAIRE_SERVICE_STATUT_ID = 2) => {
          try {
                    const sqlQuery = `
                    INSERT INTO partenaire_service (
                              ID_PARTENAIRE,
                              ID_SERVICE,
                              ID_TYPE_PARTENAIRE,
                              NOM_ORGANISATION,
                              TELEPHONE,
                              NIF,
                              EMAIL,
                              LOGO,
                              BACKGROUND_IMAGE,
                              ADRESSE_COMPLETE,
                              LATITUDE,
                              LONGITUDE,
                              PARTENAIRE_SERVICE_STATUT_ID
                              )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `
                    return query(sqlQuery, [ID_PARTENAIRE, ID_SERVICE, ID_TYPE_PARTENAIRE, NOM_ORGANISATION, TELEPHONE, NIF, EMAIL, LOGO, BACKGROUND_IMAGE, ADRESSE_COMPLETE, LATITUDE, LONGITUDE, PARTENAIRE_SERVICE_STATUT_ID])
          }
          catch (error) {

                    throw error
          }
}

const findAll = async (ID_SERVICE_CATEGORIE, q, limit = 10, offset = 0,) => {
          try {
                    var binds = []
                    var sqlQuery = `
                    SELECT ps.*, sc.ID_SERVICE_CATEGORIE FROM partenaire_service ps
                    LEFT JOIN services s ON s.ID_SERVICE = ps.ID_SERVICE
                    LEFT JOIN services_categories sc ON sc.ID_SERVICE_CATEGORIE = s.ID_SERVICE_CATEGORIE
                    WHERE 1
                    `
                    if(ID_SERVICE_CATEGORIE) {
                              sqlQuery += " AND sc.ID_SERVICE_CATEGORIE = ? "
                              binds.push(ID_SERVICE_CATEGORIE)
                    }
                    if(q && q !=""){
                        sqlQuery += "AND ps.NOM_ORGANISATION LIKE ?";
                        binds.push(`%${q}%`);
                    }
                    sqlQuery += ` ORDER BY ps.DATE_INSERTION DESC LIMIT ${offset}, ${limit}`;
                    return query(sqlQuery, binds)
          } catch (error) {
                    throw error
          }
}

const updatePartenaireService = (ID_PARTENAIRE, ID_SERVICE, ID_TYPE_PARTENAIRE, NOM_ORGANISATION, TELEPHONE, NIF, EMAIL, LOGO, BACKGROUND_IMAGE, ADRESSE_COMPLETE, LATITUDE, LONGITUDE, PARTENAIRE_SERVICE_STATUT_ID, ID_PARTENAIRE_SERVICE) => {
    try {
              const sqlQuery = `
              UPDATE partenaire_service
                        SET ID_PARTENAIRE=?,
                        ID_SERVICE=?,
                        ID_TYPE_PARTENAIRE=?,
                        NOM_ORGANISATION=?,
                        TELEPHONE=?,
                        NIF=?,
                        EMAIL=?,
                        LOGO=?,
                        BACKGROUND_IMAGE=?,
                        ADRESSE_COMPLETE=?,
                        LATITUDE=?,
                        LONGITUDE=?,
                        PARTENAIRE_SERVICE_STATUT_ID=?
                        WHERE ID_PARTENAIRE_SERVICE=?
              `
              return query(sqlQuery, [ID_PARTENAIRE, ID_SERVICE, ID_TYPE_PARTENAIRE, NOM_ORGANISATION, TELEPHONE, NIF, EMAIL, LOGO, BACKGROUND_IMAGE, ADRESSE_COMPLETE, LATITUDE, LONGITUDE, PARTENAIRE_SERVICE_STATUT_ID, ID_PARTENAIRE_SERVICE])
    }
    catch (error) {

              throw error
    }
}

module.exports = {
          createPartenaireService,
          findAll,
          updatePartenaireService
}