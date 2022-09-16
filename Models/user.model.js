const {query}=require("../utils/db");
const findBy = async (column, value) => 
{
  try 
  {
    var sqlQuery = `SELECT * FROM users  WHERE ${column} = ? `;
    return query(sqlQuery, [value]);
  } 
  catch (error) 
  {
    throw error;
  }
};
const createOne=( NOM,PRENOM,EMAIL,USERNAME,PASSWORD,ID_PROFIL,SEXE,DATE_NAISSANCE,COUNTRY_ID,ADRESSE,TELEPHONE_1,TELEPHONE_2,IMAGE)=>{
    try
      {
       var sqlQuery="INSERT INTO users (NOM,PRENOM,EMAIL,USERNAME,PASSWORD,ID_PROFIL,SEXE,DATE_NAISSANCE,COUNTRY_ID,ADRESSE,TELEPHONE_1,TELEPHONE_2,IMAGE)";
       sqlQuery+="values (?,?,?,?,?,?,?,?,?,?,?,?,?)";
       return query(sqlQuery,[
        NOM,PRENOM,EMAIL,USERNAME,PASSWORD,ID_PROFIL,SEXE,DATE_NAISSANCE,COUNTRY_ID,ADRESSE,TELEPHONE_1,TELEPHONE_2,IMAGE])
     }
     catch(error)
     {
  
     throw error
     }
  }
const findById = async (id) => {
    try {
      return query("SELECT * FROM users WHERE ID_USER  = ?",[id]);
    } catch (error) {
      throw error;
    }
};
module.exports={
    findBy,
    createOne,
    findById
}