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
module.exports = {
    findAll,
}



