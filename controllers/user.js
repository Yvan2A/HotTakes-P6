/**Le fichier "user.js" du dossier "controllers" définit la logique métier de la ressource "user".*/

//Importation du package "bcrypt" pour crypter et lire les mots de passe.
const bcrypt = require('bcrypt');
//Importation du package "jsonwebtoken" pour créer et vérifier des tokens.
const jwt = require('jsonwebtoken');
//Importation du package "crypto-js" pour chiffrer l'Email
const cryptojs = require ('crypto-js');
//Importation et chargement du package "dotenv" qui permet de gérer et manipuler les variables d'environnements.
require('dotenv').config();

//importation du modèle "User".
const User = require('../models/user');

//Exportation de la fonction "signup" qui permet la création de nouveau compte utilisateur.
exports.signup = (req, res, next) => {
    try {
        if (req.body.password === undefined) {
            throw 'Mot de passe non défini';
        }
        // On crypte le mail en HmacSHA256 pour protéger les données sensibles
        const emailCryptoJs = cryptojs.HmacSHA256(req.body.email, process.env.EMAIL_CRYPT).toString();

        // On sale le mot de passe 10 fois avec bcrypt
        bcrypt.hash(req.body.password, 10)
            .then(hash => { 
                //création d'un modèle "User" pour l'écriture dans la base MongoDB.
                const user = new User({
                    email: emailCryptoJs,
                    password: hash
                })
                //puis, enregistrement de l'instance dans la base mongoDB.
                user.save()
                    .then( () => res.status(201).json({ message: 'Utilisateur créé' }))
                    .catch(error => res.status(400).json({ error}))
            })
    }
    catch(error) {
        res.status(400).json({ message: error });
    }
};

//Exportation de la fonction "login" pour la connexion à un compte utilisateur.
exports.login = (req, res, next) => {
    //On trouve un utilisateur dans la base ayant l'email dans la requête.
    const emailCryptoJs = cryptojs.HmacSHA256(req.body.email, process.env.EMAIL_CRYPT).toString();
    User.findOne({ email: emailCryptoJs})
        .then(user => {
            //On vérifie si on a récupéré un "user" ou non dans la base.
            if(!user){
                //Si on ne trouve pas de "user" correspondant à cet email.
                return res.status(401).json({ error: 'Utilisateur non trouvé'});
            }
            //Si on trouve un "user", on compare les mots de passe de la requête à celui dans la base.
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    //Si les mots de passe ne correspondent pas.
                    if(!valid){
                        return res.status(401).json({ error: 'Mot de passe incorrect'});
                    }
                    //Si les mots de passe correspondent.
                    res.status(200).json({
                        //Attribution d'un token.
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.RANDOM_TOKEN_SECRET_KEY,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error}))
        })
        .catch(error => res.status(500).json({ error }))
};