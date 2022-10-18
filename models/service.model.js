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

const findByIdPart = async (idPartenaire) => {
    try {
        var binds = [idPartenaire]
        var sqlQuery=" SELECT s.ID_SERVICE,s.NOM AS NOM_SERVICE, s.DESCRIPTION,pr_s.NOM_ORGANISATION,pr_s.TELEPHONE, pr_s.NIF,pr_s.EMAIL,pr_s.LOGO,pr_s.BACKGROUND_IMAGE FROM services s  " 
        sqlQuery+=" LEFT JOIN partenaire_service pr_s ON s.ID_SERVICE=pr_s.ID_SERVICE  "
        sqlQuery+=" LEFT JOIN partenaires part ON part.ID_PARTENAIRE=pr_s.ID_PARTENAIRE "
        sqlQuery+=" WHERE part.ID_PARTENAIRE=? "
        return query(sqlQuery, [binds]);
    }
    catch (error) 
    {
        console.log(error)
        throw error
    }

}
module.exports = {
    findAll,
    findById,
    findByIdPart
}



