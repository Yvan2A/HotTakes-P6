/**Le fichier "user.js" du dossier "controllers" définit la logique métier de la réponse au requête.*/

//Importation du modèle "Sauce".
const Sauce = require ('../models/sauce');
//Importation du package "fs" qui permet d'accéder aux opérations liés au système de fichier.
const fs = require('fs');

//Exportation de la fonction callback "createSauce".
exports.createSauce = (req, res, next) => {
    //Transformation de la chaîne json en objet javascript.
    const sauceObject = JSON.parse(req.body.sauce);
    //si un identifiant est transmit dans la requête, on le supprime.
    delete sauceObject._id;
    //Instanciation du modèle "sauce" pour l'ajout dans la base MongoDB.
    const sauce = new Sauce({
        ...sauceObject,
        //Modification de l'url de l'image car le nom du fichier à évoluer.
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    //Enregistrement de l'instance dans la base MongoDB.
    sauce.save()
        .then(() => res.status(201).json({ message: "Sauce enregistré" }))
        .catch((error) => res.status(400).json({ error }));
}
//Exportation de la fonction callback "modifySauce".
exports.modifySauce = (req, res, next) => {
    //Récupération de l'objet "sauce" selon 2 cas de modification : avec fichier image ou sans fichier image.
    const sauceObject = req.file ?
    { 
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    //On modifie la sauce en vérifiant que l'identifiant de la base et de la requête correspondent pour la sauce et l'utilisateur.
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
        .catch(error => res.status(400).json({ error }));
}
//Exportation de la fonction callback "deleteSauce".
exports.deleteSauce = (req, res, next) => {
    //On trouve d'abord la sauce à supprimer.
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            //Extraction du nom du fichier image à supprimer.
            const filename = sauce.imageUrl.split('/images/')[1];
            //Suppression de la ressource "sauce" et du fichier image associé.
            fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
                .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};
//Exportation de la fonction callback "getOneSauce".
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
}
//Exportations de la fonction callback "getAllSauces".
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
}

//Exportation de la fonction callback "sauceLikes".
exports.sauceLikes = (req, res, next) => {
//Switch Case (1, 0, -1)
// Like
    switch (req.body.like) {
        case 1:
            Sauce.updateOne(
                { _id: req.params.id },
                { $push: { usersLiked: req.body.userId }, $inc: { likes: +1 } }
                )
            .then(() => res.status(200).json({ message: 'like !' }))
            .catch((error) => res.status(400).json({ error }));
        break;
        // Annulation like / dislike
        case 0:
            Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne(
                        { _id: req.params.id },
                        { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
                    )
                    .then(() =>
                    res.status(200).json({ message: 'like annulé !' })
                    )
                    .catch((error) => res.status(400).json({ error }));
                }
                if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne(
                        { _id: req.params.id },
                        {
                        $pull: { usersDisliked: req.body.userId },
                        $inc: { dislikes: -1 },
                        }
                    )
                    .then(() =>
                    res.status(200).json({ message: 'dislike annulé !' })
                    )
                    .catch((error) => res.status(400).json({ error }));
                }
            })
            .catch((error) => res.status(404).json({ error }));
        break;
        // Dislike
        case -1:
            Sauce.updateOne(
                { _id: req.params.id },
                { $push: { usersDisliked: req.body.userId }, $inc: { dislikes: +1 } }
            )
            .then(() => {
                res.status(200).json({ message: 'dislike !' });
            })
            .catch((error) => res.status(400).json({ error }));
        break;
        default:
            console.log(error)
    }
};