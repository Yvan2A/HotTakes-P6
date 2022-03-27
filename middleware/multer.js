const multer = require("multer")

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
