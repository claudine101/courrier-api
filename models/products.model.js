const { query } = require("../utils/db");
const findproducts = async (category) => {
    try {

        return query("SELECT pp.NOM AS NOM_PRODUIT,pp.DESCRIPTION,pp.IMAGE_1,pp.IMAGE_2,p.NOM_ORGANISATION ,pc.NOM AS NOM_CATEGORIE,psc.NOM AS NOM_SOUS_CATEGORIE,pt.NOM NOM_TAILLE,sp.PRIX FROM ecommerce_produit_partenaire pp LEFT JOIN partenaires p ON pp.ID_PARTENAIRE=p.ID_PARTENAIRE LEFT JOIN ecommerce_produit_categorie pc ON pc.ID_CATEGORIE_PRODUIT=pp.ID_CATEGORIE_PRODUIT LEFT JOIN ecommerce_produit_sous_categorie psc ON psc.ID_PRODUIT_SOUS_CATEGORIE=pp.ID_PRODUIT_SOUS_CATEGORIE LEFT JOIN ecommerce_produit_tailles pt ON pt.ID_TAILLE=pp.ID_TAILLE LEFT JOIN ecommerce_produit_stock ps  ON ps.ID_PRODUIT_PARTENAIRE=pp.ID_PRODUIT_PARTENAIRE LEFT JOIN  ecommerce_stock_prix sp ON sp.ID_PRODUIT_STOCK=ps.ID_PRODUIT_STOCK LEFT JOIN ecommerce_statut_prix st ON st.ID_STATUT=sp.ID_STATUT  WHERE st.ID_STATUT=1  AND  pp.ID_PRODUIT_SOUS_CATEGORIE=?",[category])
         ;
    }
    catch (error) {
        throw error

    }
}
const findCategories = async () => {
    try {

        return query("SELECT * FROM ecommerce_produit_categorie WHERE 1");
    }
    catch (error) {
        throw error

    }
}
const findSousCategories = async () => {
    try {

        return query("SELECT * FROM `ecommerce_produit_sous_categorie` WHERE 1");
    }
    catch (error) {
        throw error

    }
}

const findSousCategoriesBy = async (ID_CATEGORIE_PRODUIT) => {
    try {

        return query("SELECT pc.NOM AS NOM_CATEGORIE,psc.ID_PRODUIT_SOUS_CATEGORIE,psc.NOM AS NOM_SOUS_CATEGORIE FROM ecommerce_produit_sous_categorie psc LEFT JOIN ecommerce_produit_categorie pc ON pc.ID_CATEGORIE_PRODUIT=psc.ID_CATEGORIE_PRODUIT  WHERE 1 AND psc.ID_CATEGORIE_PRODUIT=?",[ID_CATEGORIE_PRODUIT]);
    }
    catch (error) {
        throw error

    }
}
const findSizes = async (ID_CATEGORIE_PRODUIT) => {
    try {

        return query("SELECT pc.NOM AS NOM_CATEGORIE,pt.NOM AS TAILLE FROM ecommerce_produit_tailles pt LEFT JOIN ecommerce_produit_categorie pc ON pc.ID_CATEGORIE_PRODUIT= pt.ID_CATEGORIE_PRODUIT  WHERE 1 AND  pt.ID_CATEGORIE_PRODUIT =?",[ID_CATEGORIE_PRODUIT] );
    }
    catch (error) {
        throw error

    }
}


module.exports = {
    findproducts,
    findCategories,
    findSousCategoriesBy,
    findSizes,
    findSousCategories
}