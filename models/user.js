/*Le fichier "User.js" permet de créer un modèle de ressource avec mongoose pour faciliter 
l'écriture et la lecture de donné dans la base de donné MongoDB. */

//Importation du package "mongoose".
const mongoose = require('mongoose');

/*Importation du package "mongoose-unique-validator" qui empêche plusieurs utilisateurs.
de se connecter avec le même adresse email.*/
const uniqueValidator = require('mongoose-unique-validator');

//schéma de données utilisateur
const userSchema = mongoose.Schema({
    email: { type: String, require: true, unique: true },
    password: { type: String, required: true}
});

//Attribution du plugin "uniqueValidator" à notre modèle "user".
userSchema.plugin(uniqueValidator);

//Exportation du modèle "user".
module.exports = mongoose.model('User', userSchema);