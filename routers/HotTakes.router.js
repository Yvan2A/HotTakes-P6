const express = require("express")
const {
  getSautes,
  createSaute,
  getSauteById,
  deleteSaute,
  modifySaute,
  likeSaute
} = require("../controllers/HotTakes")
const { authenticateUser } = require("../middleware/auth")
const { upload } = require("../middleware/multer")
const HotTakesRouter = express.Router()
const bodyParser = require("body-parser")

HotTakesRouter.use(bodyParser.json())
HotTakesRouter.use(authenticateUser)

HotTakesRouter.get("/", getSautes)
HotTakesRouter.post("/", upload.single("image"), createSaute)
HotTakesRouter.get("/:id", getSauteById)
HotTakesRouter.delete("/:id", deleteSaute)
HotTakesRouter.put("/:id", upload.single("image"), modifySaute)
HotTakesRouter.post("/:id/like", likeSaute)

module.exports = { HotTakesRouter }
