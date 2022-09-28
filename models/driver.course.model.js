const { query } = require("../utils/db");

const createOne = (ID_CATEGORIE_COURSE,CODE_UNIQUE,ADDRESSE_PICKER,LALTITUDE_PICKER,LONGITUDE_PICKER,D_STATUS_COURSE,ID_USER) => {
    try {
        var sqlQuery = "INSERT INTO driver_course (ID_CATEGORIE_COURSE,CODE_UNIQUE, "
            sqlQuery += "ADDRESSE_PICKER,LALTITUDE_PICKER,LONGITUDE_PICKER,ID_STATUS_COURSE,ID_PARTENAIRE)";
        sqlQuery += "values (?,?,?,?,?,?,?)";
        return query(sqlQuery, [ID_CATEGORIE_COURSE,CODE_UNIQUE,ADDRESSE_PICKER,LALTITUDE_PICKER,LONGITUDE_PICKER,D_STATUS_COURSE,ID_USER])
    }
    catch (error) {

        throw error
    }
}
const findbyId = async (id) => {
    try {
      return query("SELECT * FROM  driver_course WHERE ID_DRIVER_COURSE=?", [id]);
} catch (error) {
      throw error;
    }
  };
  const updateOne = async (id) => {
    try {
      return query("UPDATE ecommerce_commandes SET 	ID_STATUT=3 WHERE CODE_UNIQUE=?", [id]);
} catch (error) {
      throw error;
    }
  };

module.exports = {
    createOne,
    findbyId,
    updateOne


}