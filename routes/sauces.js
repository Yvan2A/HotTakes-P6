/**Le fichier "sauce.js" du dossier "routes" définit la logique de routing spécifique à la ressource "sauce".*/

//Importation du package "express".
const express = require('express');

//création du routeur pour les routes "sauce".
const router = express.Router();

//Importation du contrôleur et des middlewares "auth" et "multer"
const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')

//Définition des routes spécifiques de la sauce.
router.post("/", auth, multer, saucesCtrl.createSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.get('/',auth, multer, saucesCtrl.getAllSauce);
router.post('/:id/like', auth, saucesCtrl.sauceLikes);

//Exportation du router
module.exports = router;