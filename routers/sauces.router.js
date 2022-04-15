const express = require("express")
const {
  getSauces,
  createSauce,
  getSauceById,
  deleteSauce,
  modifySauce,
  likeSauce
} = require("../controllers/sauces")
const { authenticateUser } = require("../middleware/auth")
const { upload } = require("../middleware/multer")
const HotTakesRouter = express.Router()
const bodyParser = require("body-parser")

HotTakesRouter.use(bodyParser.json())
HotTakesRouter.use(authenticateUser)

HotTakesRouter.get("/", getSauces)
HotTakesRouter.post("/", upload.single("image"), createSauce)
HotTakesRouter.get("/:id", getSauceById)
HotTakesRouter.delete("/:id", deleteSauce)
HotTakesRouter.put("/:id", upload.single("image"), modifySauce)
HotTakesRouter.post("/:id/like", likeSauce)

module.exports = { HotTakesRouter }
