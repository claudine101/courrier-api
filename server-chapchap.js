const express = require("express");
const https = require('https')
const http = require('http')
const fs = require('fs');
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const ip = require('ip')
const fileUpload = require("express-fileupload");
const RESPONSE_CODES = require("./constants/RESPONSE_CODES");
const RESPONSE_STATUS = require("./constants/RESPONSE_STATUS");
const testRouter = require("./routes/test.routes");
const usersPartenaireRouter = require("./routes/users.partenaire.routes");
const partenaireProduitRouter= require("./routes/partenaire.produit.routes");
const partenaireRouter= require("./routes/partenaire.routes");
const serviceRouter= require("./routes/service.routes");
const approvisionnementRouter= require("./routes/approvisionnement.routes");

const app = express();
const bindUser=require("./middleware/bindUser");
const commandeRouter = require("./routes/commandes.routes");
dotenv.config({ path: path.join(__dirname, "./.env") });

app.use(cors());
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(fileUpload());

app.all('*', bindUser)
app.use('/test', testRouter)
app.use('/partenaire', usersPartenaireRouter)
app.use('/service', serviceRouter)
app.use('/partenaire/service', partenaireRouter)
app.use('/partenaire/produit', partenaireProduitRouter)
app.use('/partenaire/stock/approvisionnement', approvisionnementRouter)
app.use("/commandes",commandeRouter)

app.all("*", (req, res) => {
    res.status(RESPONSE_CODES.NOT_FOUND).json({
        statusCode: RESPONSE_CODES.NOT_FOUND,
        httpStatus: RESPONSE_STATUS.NOT_FOUND,
        message: "Route non trouvé",
        result: []
    })
});

const port = process.env.PORT || 8000;
const isHttps = false
if (isHttps) {
    var options = {
        key: fs.readFileSync('keys/client-key.pem'),
        cert: fs.readFileSync('keys/client-cert.pem')
    };
    https.createServer(options, app).listen(port, async () => {
        console.log(`${(process.env.NODE_ENV).toUpperCase()} Server is running on : https://${ip.address()}:${port}/`);
    });
} else {
    http.createServer(app).listen(port, async () => {
        console.log(`${(process.env.NODE_ENV).toUpperCase()} - Server is running on : http://${ip.address()}:${port}/`);
    });
}