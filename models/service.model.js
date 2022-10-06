const { query } = require("../utils/db");

//RECUPERATION DE TOUS LES SERICES
const findAll = async ( value) => {
    try {
      
        var sqlQuery="SELECT * FROM services s LEFT JOIN categories_service ca ON s.ID_CATEGORIE_SERVICE=ca.ID_CATEGORIE_SERVICE WHERE 1 "
        return query(sqlQuery, [value]);
    }
    catch (error) 
    {
        console.log(error)
        throw error
    }

}
const findById = async (ID_USER, ID_SERVICE) => {
    try {
      
        var sqlQuery="SELECT * FROM partenaires par LEFT JOIN " 
        sqlQuery+=" partenaire_service ser ON ser.ID_PARTENAIRE=par.ID_PARTENAIRE  "
        sqlQuery+=" LEFT JOIN  services srv on srv.ID_SERVICE=ser.ID_SERVICE "
        sqlQuery+=" WHERE par.ID_USER=? AND srv.ID_SERVICE=? "
        return query(sqlQuery, [ID_USER, ID_SERVICE]);
    }
    catch (error) 
    {
        console.log(error)
        throw error
    }

}
module.exports = {
    findAll,
    findById
}



