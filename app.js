/*Le fichier "app.js" contient notre application express qui gère les réponses du server suite aux requêtes.*/

//Importation du package "express".
const express = require("express");

//Importation du package "mongoose" qui facilite la manipulation de la base de donné mongoDB.
const mongoose = require("mongoose");

//Importation du package "path" qui donne accès au chemin du système de fichier server.
const path = require('path');

//Importation du package "helmet" pour sécuriser l'application contre certaines vulnérabilités.
const helmet = require('helmet');

//Importation du package "express-mongo-sanitize" pour sécuriser les données de la BDD
const mongoSanitize = require('express-mongo-sanitize');

//Chargement des variables d'environnement déclarée dans le fichier ".env".
require("dotenv").config();

//Importation du routeur "sauceRoutes".
const sauceRoutes = require('./routes/sauces');
//Importation du routeur "userRoutes".
const userRoutes = require('./routes/user')

//création de l'application express.
const app = express();

//Nettoie les données fournies par l'utilisateur pour éviter l'injection d'opérateurs MongoDB.
app.use(mongoSanitize()); 

//Sécurisation de l'application via l'inclusion d'en-tête configurée (ex: Content-Security-Policy, X-XSS-Protection, X-DNS-Prefetch-Control, Strict-Transport-Security)
app.use(helmet());

//connexion BDD
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then( () => console.log("Connexion à MongoDB réussie !"))
    .catch( () => console.log("Connexion à MongoDB échouée !"));


//middleware d'ajout des headers pour lever les restrictions de sécurité CORS.
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
});

//Importation du package anciennement "body-parser" qui facilite l'exploitation du corps des requêtes.
app.use(express.json()); 

//middleware de réponse aux requêtes de la route "/image". Il sert le dossier "images".
app.use('/images', express.static(path.join(__dirname, 'images')));

//middleware de réponse aux requêtes de la route racine "/api/sauces".
app.use('/api/sauces', sauceRoutes);
//middleware de réponse aux requêtes de la route racine "/api/auth".
app.use('/api/auth', userRoutes);

//Exportation de l'application "app.js" pour le rendre disponible dans le dossier backend.
module.exports = app;
