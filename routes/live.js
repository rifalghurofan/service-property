const express = require("express");
const router = express.Router();
const liveController = require("../controllers/live.controller");

router.get("/", liveController.getLive); // get data live previews
router.post("/add", liveController.postLive); // post data live previews
router.put("/update", liveController.putLive); // update data live previews
router.delete("/delete", liveController.deleteLive); // delete data live previews

module.exports = router;
