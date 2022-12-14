const RESPONSE_CODES = require("../constants/RESPONSE_CODES.js")
const RESPONSE_STATUS = require("../constants/RESPONSE_STATUS.js")
const productsModel = require("../models/products.model.js")
const { query } = require("../utils/db")
const Validation = require('../class/Validation')
const ProductUpload = require('../class/uploads/ProductUpload');

const getAllProducts = async (req, res) => {
    try {
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
        }
        const { q, category, subCategory, limit, offset } = req.query
        const allProducts = await productsModel.findproducts(q, category, subCategory, limit, offset)
        
        const products = await Promise.all(allProducts.map(async product => {
            const prix = (await productsModel.getPrix(product.ID_PRODUIT_PARTENAIRE))[0]
            if (prix) {
                return { 
                    produit: {
                        ID_PRODUIT: product.ID_PRODUIT,
                        NOM: product.NOM,
                        ID_PRODUIT_PARTENAIRE: product.ID_PRODUIT_PARTENAIRE,

                        IMAGE: getImageUri(product.IMAGE_1),
                    },
                    partenaire: {
                        NOM_ORGANISATION: product.NOM_ORGANISATION,
                        ID_PARTENAIRE: product.ID_PARTENAIRE,
                        ID_TYPE_PARTENAIRE: product.ID_TYPE_PARTENAIRE,
                        NOM: product.NOM_USER,
                        PRENOM: product.PRENOM
                    },
                    produit_partenaire: {
                        ID_PARTENAIRE_SERVICE: product.ID_PARTENAIRE_SERVICE,
                        NOM_ORGANISATION: product.NOM_ORGANISATION,
                        NOM: product.NOM_PRODUIT_PARTENAIRE,
                        DESCRIPTION: product.DESCRIPTION,
                        IMAGE_1: getImageUri(product.IMAGE_1),
                        IMAGE_2: getImageUri(product.IMAGE_2),
                        IMAGE_3: getImageUri(product.IMAGE_3),
                        TAILLE: product.NOM_TAILLE,
                        PRIX: prix.PRIX
                    },
                    categorie: {
                        ID_CATEGORIE_PRODUIT: product.ID_CATEGORIE_PRODUIT,
                        NOM: product.NOM_CATEGORIE
                    },
                    sous_categorie: {
                        ID_PRODUIT_SOUS_CATEGORIE: product.ID_PRODUIT_SOUS_CATEGORIE,
                        NOM: product.NOM_SOUS_CATEGORIE
                    },
                    stock: {
                        ID_PRODUIT_STOCK: product.ID_PRODUIT_STOCK,
                        QUANTITE_STOCKE: product.QUANTITE_TOTAL,
                        QUANTITE_RESTANTE: product.QUANTITE_RESTANTE,
                        QUANTITE_VENDUE: product.QUANTITE_VENDUS
                    }
                }
            }
        }
        ))
        
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Liste des produits",
            result: products
        })
    }
    catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",

        })
    }
}

const getAllProductCommandes = async (req, res) => {
    try {
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
        }
        const { q, category, subCategory, limit, offset } = req.query
        const allProducts = await productsModel.findproductCommande(q, category, subCategory, limit, offset)
        const products = await Promise.all(allProducts.map(async product => {
            const prix = (await productsModel.getPrix(product.ID_PRODUIT_PARTENAIRE))[0]
            if (prix) {
                return { 
                    produit: {
                        ID_PRODUIT: product.ID_PRODUIT,
                        NOM: product.NOM,
                        ID_PRODUIT_PARTENAIRE: product.ID_PRODUIT_PARTENAIRE,

                        IMAGE: getImageUri(product.IMAGE_1),
                    },
                    partenaire: {
                        NOM_ORGANISATION: product.NOM_ORGANISATION,
                        ID_PARTENAIRE: product.ID_PARTENAIRE,
                        ID_TYPE_PARTENAIRE: product.ID_TYPE_PARTENAIRE,
                        NOM: product.NOM_USER,
                        PRENOM: product.PRENOM
                    },
                    produit_partenaire: {
                        ID_PARTENAIRE_SERVICE: product.ID_PARTENAIRE_SERVICE,
                        NOM_ORGANISATION: product.NOM_ORGANISATION,
                        NOM: product.NOM_PRODUIT_PARTENAIRE,
                        DESCRIPTION: product.DESCRIPTION,
                        IMAGE_1: getImageUri(product.IMAGE_1),
                        IMAGE_2: getImageUri(product.IMAGE_2),
                        IMAGE_3: getImageUri(product.IMAGE_3),
                        TAILLE: product.NOM_TAILLE,
                        PRIX: prix.PRIX
                    },
                    categorie: {
                        ID_CATEGORIE_PRODUIT: product.ID_CATEGORIE_PRODUIT,
                        NOM: product.NOM_CATEGORIE
                    },
                    sous_categorie: {
                        ID_PRODUIT_SOUS_CATEGORIE: product.ID_PRODUIT_SOUS_CATEGORIE,
                        NOM: product.NOM_SOUS_CATEGORIE
                    },
                    stock: {
                        ID_PRODUIT_STOCK: product.ID_PRODUIT_STOCK,
                        QUANTITE_STOCKE: product.QUANTITE_TOTAL,
                        QUANTITE_RESTANTE: product.QUANTITE_RESTANTE,
                        QUANTITE_VENDUE: product.QUANTITE_VENDUS
                    }
                }
            }
        }
        ))
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Liste des produits",
            result: products
        })
    }
    catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",

        })
    }
}

const updatePhoto = async (req, res) => {
    try {
        const { ID_PRODUIT,index } = req.params
        const { IMAGE } = req.files || {}
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
        }
        const productUpload = new ProductUpload ()
        const { fileInfo, thumbInfo } = await productUpload.upload(IMAGE, false)
        const { insertId: insertMenu } = await productsModel.updateImage(
            fileInfo.fileName,
            index,
            ID_PRODUIT,
        )
        const productUpdate = await query("SELECT IMAGE_1 ,IMAGE_2,IMAGE_3 FROM ecommerce_produits WHERE ID_PRODUIT=? ",[ID_PRODUIT])
        const imageUpdate = productUpdate.map(product => ({
            IMAGE_1: getImageUri(product.IMAGE_1),
            IMAGE_2: getImageUri(product.IMAGE_2),
            IMAGE_3: getImageUri(product.IMAGE_3),
        }))
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_CODES.OK,
            message: "Update des menu est faites avec succes",
            result:imageUpdate
        })

    }
    catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",

        })
    }
}
const updateNom = async (req, res) => {
    try {
       const{NOM}=req.body
       const{ID_PRODUIT}=req.params
         await query("UPDATE   ecommerce_produits SET NOM = ? WHERE ID_PRODUIT=? ",[NOM,ID_PRODUIT])
         const productUpdate = (await query("SELECT NOM FROM  ecommerce_produits WHERE ID_PRODUIT=? " ,[ID_PRODUIT]))[0]
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_CODES.OK,
            message: "Update des produits est faites avec succes",
            result:productUpdate
        })

    }
    catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",

        })
    }
}
const updateDescription= async (req, res) => {
    try {
       const{DESCRIPTION}=req.body
       const{ID_PRODUIT_PARTENAIRE}=req.params
         await query("UPDATE   ecommerce_produit_partenaire SET DESCRIPTION = ? WHERE ID_PRODUIT_PARTENAIRE=? ",[DESCRIPTION,ID_PRODUIT_PARTENAIRE])
         const productUpdate = (await query("SELECT DESCRIPTION FROM  ecommerce_produit_partenaire WHERE ID_PRODUIT_PARTENAIRE=? " ,[ID_PRODUIT_PARTENAIRE]))[0]
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_CODES.OK,
            message: "Update des produits est faites avec succes",
            result:productUpdate
        })

    }
    catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",

        })
    }
}
const updateApprovisionner= async (req, res) => {
    try {
       var {ID_COULEUR_NEW,ID_TAILLE_NEW,QUANTITE_RESTANTE,ID_TAILLE,ID_COULEUR,COULEUR,TAILLE}=req.body
if(TAILLE)
{
    const { insertId:ID }= await query("INSERT INTO ecommerce_produit_tailles (TAILLE) values (?) " ,[TAILLE])
    ID_TAILLE=ID
}
if(COULEUR)
{
    const {insertId:ID }= await query("INSERT INTO ecommerce_produit_couleur (COULEUR) values (?) " ,[COULEUR])
    ID_COULEUR=ID
}
       const{ID_PRODUIT_PARTENAIRE}=req.params
       const STOCK= (await query("SELECT ID_PRODUIT_STOCK FROM  ecommerce_produit_stock WHERE ID_PRODUIT_PARTENAIRE=? " ,[ID_PRODUIT_PARTENAIRE]))[0]
if(COULEUR && TAILLE ){
    const {insertId:ID }= await query("INSERT INTO ecommerce_produit_details (ID_PRODUIT_STOCK,ID_COULEUR,ID_TAILLE,QUANTITE_TOTAL,QUANTITE_RESTANTE) values (?,?,?,?,?) " ,[STOCK.ID_PRODUIT_STOCK,ID_COULEUR,ID_TAILLE,QUANTITE_RESTANTE,QUANTITE_RESTANTE])
}
else if(COULEUR){
    const {insertId:ID }= await query("INSERT INTO ecommerce_produit_details (ID_PRODUIT_STOCK,ID_COULEUR,ID_TAILLE,QUANTITE_TOTAL,QUANTITE_RESTANTE) values (?,?,?,?,?) " ,[STOCK.ID_PRODUIT_STOCK,ID_COULEUR,ID_TAILLE,QUANTITE_RESTANTE,QUANTITE_RESTANTE])
}
else if(TAILLE){
    const {insertId:ID }= await query("INSERT INTO ecommerce_produit_details (ID_PRODUIT_STOCK,ID_COULEUR,ID_TAILLE,QUANTITE_TOTAL,QUANTITE_RESTANTE) values (?,?,?,?,?) " ,[STOCK.ID_PRODUIT_STOCK,ID_COULEUR,ID_TAILLE,QUANTITE_RESTANTE,QUANTITE_RESTANTE])
}


else{
    if(ID_COULEUR_NEW!='undefined' && ID_TAILLE_NEW=='undefined'){
        await query("UPDATE   ecommerce_produit_details SET ID_COULEUR=? ,QUANTITE_RESTANTE = ? ,QUANTITE_TOTAL = ? WHERE ID_PRODUIT_STOCK=?  AND ID_COULEUR=? AND ID_TAILLE=?",[ID_COULEUR_NEW ,QUANTITE_RESTANTE,QUANTITE_RESTANTE,STOCK.ID_PRODUIT_STOCK,ID_COULEUR,ID_TAILLE])
    }
    else if(ID_COULEUR_NEW=='undefined' && ID_TAILLE_NEW!='undefined'){
        await query("UPDATE   ecommerce_produit_details SET ID_TAILLE=? , QUANTITE_RESTANTE = ? ,QUANTITE_TOTAL = ? WHERE ID_PRODUIT_STOCK=?  AND ID_COULEUR=? AND ID_TAILLE=?",[ID_TAILLE_NEW,QUANTITE_RESTANTE,QUANTITE_RESTANTE,STOCK.ID_PRODUIT_STOCK,ID_COULEUR,ID_TAILLE])
    }
    else if(ID_COULEUR_NEW!='undefined' && ID_TAILLE_NEW!='undefined'){
        await query("UPDATE   ecommerce_produit_details SET ID_COULEUR=?,ID_TAILLE=? ,QUANTITE_RESTANTE = ? ,QUANTITE_TOTAL = ? WHERE ID_PRODUIT_STOCK=?  AND ID_COULEUR=? AND ID_TAILLE=?",[ID_COULEUR_NEW ,ID_TAILLE_NEW,QUANTITE_RESTANTE,QUANTITE_RESTANTE,STOCK.ID_PRODUIT_STOCK,ID_COULEUR,ID_TAILLE])
    }
   
    else{
    await query("UPDATE   ecommerce_produit_details SET QUANTITE_RESTANTE = ? ,QUANTITE_TOTAL = ? WHERE ID_PRODUIT_STOCK=?  AND ID_COULEUR=? AND ID_TAILLE=?",[QUANTITE_RESTANTE,QUANTITE_RESTANTE,STOCK.ID_PRODUIT_STOCK,ID_COULEUR,ID_TAILLE])
}
}
       const productUpdate = (await productsModel.findQte(STOCK.ID_PRODUIT_STOCK,ID_TAILLE,ID_COULEUR))[0]
      
       const sizes = await productsModel.findSize(ID_PRODUIT_PARTENAIRE)
       const Quantite_size = await Promise.all(sizes.map(async size => {
           const quantite=(await query("SELECT SUM(QUANTITE_RESTANTE) AS quantite FROM ecommerce_produit_details WHERE  ID_TAILLE= ? GROUP BY ID_TAILLE",[size.id]))[0]
               return {
                   id: size.id,
                    name: size.name,
                    quantite:quantite.quantite
               }
           }
       ))
       const colors = await productsModel.findColor(ID_PRODUIT_PARTENAIRE, ID_TAILLE)
         res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_CODES.OK,
            message: "Update des produits est faites avec succes",
            color_update:colors,
            result:productUpdate,
            size_update:Quantite_size,
            

        })

    }
    catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",

        })
    }
}
const updatePrice= async (req, res) => {
    try {
       const{PRIX}=req.body
       const{ID_PRODUIT_PARTENAIRE}=req.params
       const STOCK= (await query("SELECT ID_PRODUIT_STOCK FROM  ecommerce_produit_stock WHERE ID_PRODUIT_PARTENAIRE=? " ,[ID_PRODUIT_PARTENAIRE]))[0]

       await query("UPDATE   ecommerce_stock_prix SET PRIX = ?  WHERE ID_PRODUIT_STOCK=? ",[PRIX,STOCK.ID_PRODUIT_STOCK])
         const prixUpdate = (await query("SELECT PRIX FROM  ecommerce_stock_prix WHERE ID_PRODUIT_STOCK=? ",[STOCK.ID_PRODUIT_STOCK]))[0]
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_CODES.OK,
            message: "Update des produits est faites avec succes",
            result:prixUpdate
        })

    }
    catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",

        })
    }
}
const getProductResearch = async (req, res) => {
    try {
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
        }
        const { q, category, subCategory, limit, offset } = req.query
        const allProducts = await productsModel.findproductsResearch(q, category, subCategory, limit, offset)
        const products = await Promise.all(allProducts.map(async product => {
            const prix = (await productsModel.getPrix(product.ID_PRODUIT_PARTENAIRE))[0]
            if (prix) {
                return {
                    produit: {
                        ID_PRODUIT: product.ID_PRODUIT,
                        NOM: product.NOM,
                        ID_PRODUIT_PARTENAIRE: product.ID_PRODUIT_PARTENAIRE,

                        IMAGE: getImageUri(product.IMAGE_1),
                    },
                    partenaire: {
                        NOM_ORGANISATION: product.NOM_ORGANISATION,
                        ID_PARTENAIRE: product.ID_PARTENAIRE,
                        ID_TYPE_PARTENAIRE: product.ID_TYPE_PARTENAIRE,
                        NOM: product.NOM_USER,
                        PRENOM: product.PRENOM
                    },
                    produit_partenaire: {
                        ID_PARTENAIRE_SERVICE: product.ID_PARTENAIRE_SERVICE,
                        NOM_ORGANISATION: product.NOM_ORGANISATION,
                        NOM: product.NOM_PRODUIT_PARTENAIRE,
                        DESCRIPTION: product.DESCRIPTION,
                        IMAGE_1: getImageUri(product.IMAGE_1),
                        IMAGE_2: getImageUri(product.IMAGE_2),
                        IMAGE_3: getImageUri(product.IMAGE_3),
                        TAILLE: product.NOM_TAILLE,
                        PRIX: prix.PRIX
                    },
                    categorie: {
                        ID_CATEGORIE_PRODUIT: product.ID_CATEGORIE_PRODUIT,
                        NOM: product.NOM_CATEGORIE
                    },
                    sous_categorie: {
                        ID_PRODUIT_SOUS_CATEGORIE: product.ID_PRODUIT_SOUS_CATEGORIE,
                        NOM: product.NOM_SOUS_CATEGORIE
                    },
                    stock: {
                        ID_PRODUIT_STOCK: product.ID_PRODUIT_STOCK,
                        QUANTITE_STOCKE: product.QUANTITE_TOTAL,
                        QUANTITE_RESTANTE: product.QUANTITE_RESTANTE,
                        QUANTITE_VENDUE: product.QUANTITE_VENDUS
                    }
                }
            }
        }
        ))
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Liste des produits",
            result: products
        })
    }
    catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",

        })
    }
}
const getAllProduct = async (req, res) => {
    try {
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
        }
        const { wishlist, category, subCategory, limit, offset } = req.query

        const allProducts = await productsModel.findproduct(req.userId, category, subCategory, limit, offset)
        const products = await Promise.all(allProducts.map(async product => {
             const prix = (await productsModel.getPrix(product.ID_PRODUIT_PARTENAIRE))[0]
             //if (prix) 
             {
            return {
                produit: {
                    ID_PRODUIT: product.ID_PRODUIT,
                    NOM: product.NOM,
                    ID_PRODUIT_PARTENAIRE: product.ID_PRODUIT_PARTENAIRE,

                    IMAGE: getImageUri(product.IMAGE_1),
                },
                partenaire: {
                    NOM_ORGANISATION: product.NOM_ORGANISATION,
                    ID_PARTENAIRE: product.ID_PARTENAIRE,
                    ID_TYPE_PARTENAIRE: product.ID_TYPE_PARTENAIRE,
                    NOM: product.NOM_USER,
                    PRENOM: product.PRENOM
                },
                produit_partenaire: {
                    ID_PARTENAIRE_SERVICE: product.ID_PARTENAIRE_SERVICE,
                    NOM_ORGANISATION: product.NOM_ORGANISATION,
                    NOM: product.NOM_PRODUIT_PARTENAIRE,
                    DESCRIPTION: product.DESCRIPTION,
                    IMAGE_1: getImageUri(product.IMAGE_1),
                    IMAGE_2: getImageUri(product.IMAGE_2),
                    IMAGE_3: getImageUri(product.IMAGE_3),
                    TAILLE: product.NOM_TAILLE,
                    PRIX: prix.PRIX
                },
                categorie: {
                    ID_CATEGORIE_PRODUIT: product.ID_CATEGORIE_PRODUIT,
                    NOM: product.NOM_CATEGORIE
                },
                sous_categorie: {
                    ID_PRODUIT_SOUS_CATEGORIE: product.ID_PRODUIT_SOUS_CATEGORIE,
                    NOM: product.NOM_SOUS_CATEGORIE
                },
                stock: {
                    ID_PRODUIT_STOCK: product.ID_PRODUIT_STOCK,
                    QUANTITE_STOCKE: product.QUANTITE_TOTAL,
                    QUANTITE_RESTANTE: product.QUANTITE_RESTANTE,
                    QUANTITE_VENDUE: product.QUANTITE_VENDUS
                }
            }
        }
            }
        ))
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Liste des produits",
            result: products
        })
    }
    catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",

        })
    }
}
const getOne = async (req, res) => {
    try {
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
        }

        const { ID_PRODUIT } = req.params

        const oneProduct = await productsModel.findone(ID_PRODUIT)
        const products = oneProduct.map(product => ({
            produit: {
                ID_PRODUIT: product.ID_PRODUIT,
                NOM: product.NOM,
                IMAGE: product.IMAGE
            },
            produit_partenaire: {
                ID_PRODUIT: product.ID_PRODUIT,
                NOM_ORGANISATION: product.NOM_ORGANISATION,
                NOM: product.NOM_PRODUIT_PARTENAIRE,
                DESCRIPTION: product.DESCRIPTION,
                IMAGE_1: getImageUri(product.IMAGE_1),
                IMAGE_2: getImageUri(product.IMAGE_2),
                IMAGE_3: getImageUri(product.IMAGE_3),
                TAILLE: product.NOM_TAILLE,
                PRIX: product.PRIX
            },
            categorie: {
                ID_CATEGORIE_PRODUIT: product.ID_CATEGORIE_PRODUIT,
                NOM: product.NOM_CATEGORIE
            },
            sous_categorie: {
                ID_PRODUIT_SOUS_CATEGORIE: product.ID_PRODUIT_SOUS_CATEGORIE,
                NOM: product.NOM_SOUS_CATEGORIE
            },
            stock: {
                ID_PRODUIT_STOCK: product.ID_PRODUIT_STOCK,
                QUANTITE_STOCKE: product.QUANTITE_STOCKE,
                QUANTITE_RESTANTE: product.QUANTITE_RESTANTE,
                QUANTITE_VENDUE: product.QUANTITE_VENDUE
            }
        }))
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Le produit",
            result: products
        })
    }
    catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",

        })
    }
}
const getbyIDOL = async (req, res) => {
    try {
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
        }

        const { ID_PARTENAIRE_SERVICE, limit, offset } = req.params

        const oneProduct = await productsModel.findBYidPartenaire(ID_PARTENAIRE_SERVICE, limit, offset)
        const details = await Promise.all(oneProduct.map( async product => { 
            const detail = (await productsModel.getdetail(product.ID_PRODUIT_PARTENAIRE))
              
            return {
                produit: {
                    ID_PRODUIT: product.ID_PRODUIT,
                    NOM: product.NOM,
                    IMAGE: product.IMAGE,
                    ID_PRODUIT_PARTENAIRE: product.ID_PRODUIT_PARTENAIRE,
                },
                partenaire: {
                    NOM_ORGANISATION: product.NOM_ORGANISATION,
                    ID_PARTENAIRE: product.ID_PARTENAIRE,

                },
                produit_partenaire: {
                    ID_PARTENAIRE_SERVICE: product.ID_PARTENAIRE_SERVICE,
                    NOM_ORGANISATION: product.NOM_ORGANISATION,
                    NOM: product.NOM,
                    DESCRIPTION: product.DESCRIPTION,
                    IMAGE_1: getImageUri(product.IMAGE_1),
                    IMAGE_2: getImageUri(product.IMAGE_2),
                    IMAGE_3: getImageUri(product.IMAGE_3),
                    TAILLE: detail.TAILLE,
                    PRIX: product.PRIX
                },
                categorie: {
                    ID_CATEGORIE_PRODUIT: product.ID_CATEGORIE_PRODUIT,
                    NOM:product.NOM_CATEGORIE
                },
                sous_categorie: {
                    ID_PRODUIT_SOUS_CATEGORIE: product.ID_PRODUIT_SOUS_CATEGORIE,
                    NOM:product.NOM_SOUS_CATEGORIE
                },
                detail: {
                    ID_PRODUIT_STOCK: product.ID_PRODUIT_STOCK,
                    QUANTITE_STOCKE:detail.QUANTITE_TOTAL,
                    QUANTITE_RESTANTE:detail.QUANTITE_RESTANTE,
                    QUANTITE_VENDUE:detail.QUANTITE_VENDUS
                }
            }
        
            
        }))
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Le produit",
            result: details
        })
    }
    catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",

        })
    }
}
const getbyID = async (req, res) => {
    try {
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
        }
        const { q, category, subCategory, limit, offset } = req.query
        const { ID_PARTENAIRE_SERVICE } = req.params

        const allProducts = await productsModel.findBYidPartenaire(ID_PARTENAIRE_SERVICE, limit, offset)
        const products = await Promise.all(allProducts.map(async product => {
            const prix = (await productsModel.getPrix(product.ID_PRODUIT_PARTENAIRE))[0]
            if (prix) {
                return {
                    produit: {
                        ID_PRODUIT: product.ID_PRODUIT,
                        NOM: product.NOM,
                        ID_PRODUIT_PARTENAIRE: product.ID_PRODUIT_PARTENAIRE,

                        IMAGE: getImageUri(product.IMAGE_1),
                    },
                    partenaire: {
                        NOM_ORGANISATION: product.NOM_ORGANISATION,
                        ID_PARTENAIRE: product.ID_PARTENAIRE,
                        ID_TYPE_PARTENAIRE: product.ID_TYPE_PARTENAIRE,
                        NOM: product.NOM_USER,
                        PRENOM: product.PRENOM
                    },
                    produit_partenaire: {
                        ID_PARTENAIRE_SERVICE: product.ID_PARTENAIRE_SERVICE,
                        NOM_ORGANISATION: product.NOM_ORGANISATION,
                        NOM: product.NOM_PRODUIT_PARTENAIRE,
                        DESCRIPTION: product.DESCRIPTION,
                        IMAGE_1: getImageUri(product.IMAGE_1),
                        IMAGE_2: getImageUri(product.IMAGE_2),
                        IMAGE_3: getImageUri(product.IMAGE_3),
                        TAILLE: product.NOM_TAILLE,
                        PRIX: prix.PRIX
                    },
                    categorie: {
                        ID_CATEGORIE_PRODUIT: product.ID_CATEGORIE_PRODUIT,
                        NOM: product.NOM_CATEGORIE
                    },
                    sous_categorie: {
                        ID_PRODUIT_SOUS_CATEGORIE: product.ID_PRODUIT_SOUS_CATEGORIE,
                        NOM: product.NOM_SOUS_CATEGORIE
                    },
                    stock: {
                        ID_PRODUIT_STOCK: product.ID_PRODUIT_STOCK,
                        QUANTITE_STOCKE: product.QUANTITE_TOTAL,
                        QUANTITE_RESTANTE: product.QUANTITE_RESTANTE,
                        QUANTITE_VENDUE: product.QUANTITE_VENDUS
                    }
                }
            }
        }
        ))
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Liste des produits",
            result: products
        })
    }
    catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",

        })
    }
}
const getAllCategorie = async (req, res) => {
    try {

        const {q}= req.query
        const categories = await productsModel.findCategories(q)

        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Liste des categories",
            result: categories


        })

    }
    catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",

        })
    }
}

const getDeatail = async (req, res) => {
    try {
        const { ID_PRODUIT_PARTENAIRE, limit, offset } = req.params
        const details = await productsModel.finddetails(ID_PRODUIT_PARTENAIRE)

        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Les deatils prduits",
            result: details


        })

    }
    catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",

        })
    }
}


const getAllNotes = async (req, res) => {
    try {
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
        }

        const { ID_PRODUIT_PARTENAIRE, limit, offset } = req.params

        const noteListe = await productsModel.findBYidProduitPartenaire(ID_PRODUIT_PARTENAIRE, limit, offset)
        const notes = noteListe.map(note => ({
            produit_note: {
                NOTE: note.NOTE,
                COMENTAIRE: note.COMMENTAIRE,
                DATE: note.DATE_INSERTION,
                ID_PRODUIT_PARTENAIRE: note.ID_PRODUIT_PARTENAIRE
            },

            utilisateur: {

                IMAGE: getImageUri(note.IMAGE),
                ID_USER: note.ID_USER,
                NOM: note.NOM,
                PRENOM: note.PRENOM
            },


        }))
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Les notes",
            result: notes
        })
    }
    catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",

        })
    }
}
const getnotes = async (req, res) => {
    try {
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
        }

        const { ID_PRODUIT_PARTENAIRE } = req.params

        const noteListe = await productsModel.findnoteProduitPartenaire(ID_PRODUIT_PARTENAIRE, req.userId)

        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "La commentaire",
            result: noteListe
        })
    }
    catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",

        })
    }
}

const insertNote = async (req, res) => {

    try {


        const { ID_PRODUIT_PARTENAIRE, NOTE, COMMENTAIRE } = req.body
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
        }
        const validation = new Validation(req.body,
            {


                NOTE:
                {
                    required: true,
                },




            },
            {

                NOTE: {
                    required: "La note est obligatoire"
                },





            }

        )

        await validation.run();
        const isValide = await validation.isValidate()
        const errors = await validation.getErrors()
        if (!isValide) {
            return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
                statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
                httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
                message: "Probleme de validation des donnees",
                result: errors
            })

        }



        const { insertId } = await productsModel.createNotes(
            req.userId,
            ID_PRODUIT_PARTENAIRE,
            NOTE,
            COMMENTAIRE,

        )
        const note = (await productsModel.findById(insertId))[0]
        const notes = {
            produit_note: {
                NOTE: note.NOTE,
                COMENTAIRE: note.COMMENTAIRE,
                DATE: note.DATE_INSERTION,
                ID_PRODUIT_PARTENAIRE: note.ID_PRODUIT_PARTENAIRE
            },

            utilisateur: {

                IMAGE: getImageUri(note.IMAGE),
                ID_USER: note.ID_USER,
                NOM: note.NOM,
                PRENOM: note.PRENOM
            },
        }
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "le commentaire",
            result: notes


        })


    }
    catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Enregistrement echoue",

        })
    }
}
const getAllColors = async (req, res) => {
    try {
const{ID_CATEGORIE_PRODUIT}=req.params
        const colors = await query("SELECT * FROM ecommerce_produit_couleur WHERE ID_CATEGORIE_PRODUIT=?",[ID_CATEGORIE_PRODUIT])
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Liste des colors",
            result: colors
        })
    }
    catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",

        })
    }
}
const getAllSizes = async (req, res) => {
    try {
const {ID_CATEGORIE_PRODUIT}=req.params
        const taillesALL = await query("SELECT * FROM ecommerce_produit_tailles WHERE ID_CATEGORIE_PRODUIT=?",[ID_CATEGORIE_PRODUIT])
        const tailles = await Promise.all(taillesALL.map(async taille => {
                return {
                    id: taille.ID_TAILLE,
                     name: taille.TAILLE,
                }
            }
        ))
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Liste des tailles",
            result: tailles


        })

    }
catch (error) {
    console.log(error)
    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
        statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
        httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
        message: "Erreur interne du serveur, réessayer plus tard",

    })
}
}
const getCategorieByPartenaire = async (req, res) => {
    try {
        const { ID_PARTENAIRE_SERVICE } = req.params

        const categories = await productsModel.findCategoriesPartnaire(ID_PARTENAIRE_SERVICE)

        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Liste des categories",
            result: categories


        })

    }
    catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",

        })
    }
}
const getAllSubCategories = async (req, res) => {
    try {

        const sous_categories = await productsModel.findSousCategories()
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Liste des sous categories",
            result: sous_categories


        })

    }
    catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",

        })
    }
}
const getSousCategoriesBy = async (req, res) => {
    try {
        const { ID_CATEGORIE_PRODUIT } = req.params
        const subCategories = await productsModel.findSousCategoriesBy(ID_CATEGORIE_PRODUIT)
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Liste des sous categories des produits",
            result: subCategories


        })

    }
    catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",

        })
    }
}
const getSizes = async (req, res) => {
    try {
        const { ID_CATEGORIE_PRODUIT, ID_PRODUIT_SOUS_CATEGORIE } = req.params

        const sizes = await productsModel.findSizes(ID_CATEGORIE_PRODUIT, ID_PRODUIT_SOUS_CATEGORIE)
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Liste des tailles des produits",
            result: sizes
        })
    }
    catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",

        })
    }
}
const getSize = async (req, res) => {
    try {
        const { ID_PRODUIT_PARTENAIRE } = req.params
        const sizes = await productsModel.findSize(ID_PRODUIT_PARTENAIRE)
        const Quantite_size = await Promise.all(sizes.map(async size => {
            const quantite=(await query("SELECT SUM(QUANTITE_RESTANTE) AS quantite FROM ecommerce_produit_details WHERE  ID_TAILLE= ? GROUP BY ID_TAILLE",[size.id]))[0]
                return {
                    id: size.id,
                     name: size.name,
                     quantite:quantite.quantite
                }
            }
        ))
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Liste des tailles des produits",
            result: Quantite_size
        })
    }
    catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",

        })
    }
}
const getColor = async (req, res) => {
    try {
        const { ID_TAILLE, ID_PRODUIT_PARTENAIRE } = req.params
        const colors = await productsModel.findColor(ID_PRODUIT_PARTENAIRE, ID_TAILLE)
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Liste des couleur des produits",
            result: colors
        })
    }
    catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",

        })
    }
}

module.exports = {
    getColor,
    getAllProducts,
    getProductResearch,
    getAllProduct,
    getAllCategorie,
    getSousCategoriesBy,
    getAllProductCommandes,
    getSizes,
    getSize,
    getAllSubCategories,
    getOne,
    getCategorieByPartenaire,
    getbyID,
    updateDescription,
    updateApprovisionner,
    updatePrice,
    getAllColors,
    insertNote,
    getAllNotes,
    getnotes,
    updatePhoto,
    updateNom,
    getDeatail,
    getAllSizes


}