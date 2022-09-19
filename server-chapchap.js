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
const usersRouter = require("./routes/users.routes");
const commandeRouter = require("./routes/commandes.routes")
const productsRouter = require("./routes/products.routes")
const app = express();
const bindUser = require("./middleware/bindUser")

dotenv.config({ path: path.join(__dirname, "./.env") });

app.use(cors());
app.use(express.static(__dirname + "/public"));
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all('*',bindUser)
app.use('/test', testRouter)
app.use('/users', usersRouter)
app.use("/commandes",commandeRouter)
app.use('/products', productsRouter)

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