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
const partenaireProduitRouter = require("./routes/partenaire.produit.routes");
const partenaireRouter = require("./routes/partenaire.routes");
const serviceRouter = require("./routes/service.routes");
const approvisionnementRouter = require("./routes/approvisionnement.routes");
const userPartenaireRouter = require("./routes/users.partenaire.routes");
const restoMenuRouter =require("./routes/resto.menu.routes");
const restoCommandeRouter = require("./routes/resto.commandes.routes");
const menuRouter = require("./routes/restaurant.menu.routes");
const partenaireTypeRouter = require("./routes/partenaire.type.routes")
const repasRouter = require("./routes/restaurant.repas.routes");
const driverCourseRouter = require("./routes/driver.course.routes");
const app = express();
const bindUser = require("./middleware/bindUser");
const commandeRouter = require("./routes/commandes.routes");
const productsRouter = require("./routes/products.routes");
const wishlistRouter = require("./routes/wishlist.routes");
const stockRouter = require("./routes/stock.router");
dotenv.config({ path: path.join(__dirname, "./.env") });

const { Server } = require("socket.io");
const paymentRouter = require("./routes/payment.routes");

app.use(cors());
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(fileUpload());
app.all('*', bindUser)
app.use('/test', testRouter)
app.use('/users', usersRouter)
app.use('/partenaire', userPartenaireRouter)
app.use('/service', serviceRouter)
app.use('/partenaire/type', partenaireTypeRouter)
app.use('/partenaire/service', partenaireRouter)
app.use('/partenaire/produit', partenaireProduitRouter)
app.use('/resto/menu', menuRouter)
app.use('/partenaire/stock/approvisionnement', approvisionnementRouter)
app.use("/commandes", commandeRouter)
app.use("/resto/commandes", restoCommandeRouter)
app.use("/products", productsRouter)
app.use("/resto/menu", restoMenuRouter)
app.use("/resto/repas", repasRouter)
app.use("/driver/course", driverCourseRouter)
app.use("/payments", paymentRouter)
app.use("/wishlist", wishlistRouter)
app.use("/produit", stockRouter)

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
          const server = http.createServer(app);
          const io = new Server(server);
          io.on('connection', socket => {
                    socket.on('join', (data) => {
                              console.log(data.userId, "Connect to a socket")
                              socket.join(data.userId)
                    })
          })
          io.on('disconnect', () => {
                    console.log('user disconnected')
          })
          app.io = io
          server.listen(port, async () => {
                    console.log(`${(process.env.NODE_ENV).toUpperCase()} - Server is running on : http://${ip.address()}:${port}/`);
          });
}