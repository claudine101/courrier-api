const { query } = require("../utils/db");
const findAll = async ( value) => {
    try {
      
        var sqlQuery="SELECT * FROM `partenaires_types` WHERE 1"
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