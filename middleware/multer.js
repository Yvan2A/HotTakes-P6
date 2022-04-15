//Importation du package Multer
const multer = require("multer")

//type de fichier accepté
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// On enregistre les fichiers 
const storage = multer.diskStorage({
  destination: "images/",
  filename: function (req, file, callback) {
    callback(null, makeFilename(req, file))
  }
})
//Nom du fichier
function makeFilename(req, file) {
  console.log("req, file:", file)
  const fileName = `${Date.now()}-${file.originalname}`.replace(/\s/g, "-")
  file.fileName = fileName
  return fileName
}
const upload = multer({ storage })

module.exports = {upload}
