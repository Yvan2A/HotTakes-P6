/*Le fichier "auth.js" définit le middleware de validation des tokens envoyés à travers les requêtes.*/

//Importation du package "jsonwebtoken".
const jwt = require('jsonwebtoken');

//Exportation d'un middleware classique.
module.exports = (req, res, next) => {
    //Bloc try/catch pour la gestion des erreurs.
    try {
        if (req.headers.authorization === undefined) {
            throw 'Les headers d\'autorisation sont absents';
        }
        //récupération du token dans le header de la requête.
        const token = req.headers.authorization.split(' ')[1];

        //décodage du token en objet js.
        const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET_KEY);

        //Extraction du "userId" dans le token décodé.
        const userId = decodedToken.userId;
        req.auth = { userId };
        /*Si le "userId" de la requête et du token ne correspondent pas alors la requête est "non autorisée". */
        if(req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valide';
        } else {
            //Si les "userId" correspondent.
            next();
        }
    //Erreur d'authentification (code 401).
    } catch (error){
        res.status(401).json({ error: error || 'Requête non authentifiée'});
    }
}