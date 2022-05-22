/*Le fichier "server.js" va écouter les requêtes frontend et servir une réponse en retour.*/

//Importation du package "http"
const http = require("http");

//Importation de l'application express.
const app = require("./app");

//Utilisation des variables d'environnement
require("dotenv").config();

//Fonctions d'optimisation du fichier server.js:
//fonction "normalizePort" renvoie un port qu'il soit fournit sous forme de numéro ou de chaîne de caractère.
const normalizePort = (val) => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
//Définition du port dans l'espace globale.
const port = normalizePort(process.env.PORT || "3000");

//Réglage du port sur lequel l'application doit écouter les requêtes frontend.
app.set("port", port);

//fonction "errorHandler" recherche et gère les erreurs.
const errorHandler = (error) => {
    if (error.syscall !== "listen") {
        throw error;
    }
    const address = server.address();
    const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
    switch (error.code) {
        case "EACCES":
        console.error(bind + " requires elevated privileges.");
        process.exit(1);
        break;
        case "EADDRINUSE":
        console.error(bind + " is already in use.");
        process.exit(1);
        break;
        default:
        throw error;
    }
};
//Création du serveur node
const server = http.createServer(app);

//Enregistrement d'écouteurs d'événement.
server.on("error", errorHandler);
server.on("listening", () => {
    const address = server.address();
    const bind = typeof address === "string" ? "pipe " + address : "port " + port;
    console.log("Listening on " + bind);
});

//Le server écoute le port.
server.listen(port);
