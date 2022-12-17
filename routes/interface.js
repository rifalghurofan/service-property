const express = require("express");
const router = express.Router();
const interfaceController = require("../controllers/interface.controller");

router.get("/", interfaceController.getInterface); // get data interface previews
router.get("/readJson", interfaceController.readJson); // get data interface previews
router.post("/add", interfaceController.postInterface); // post data interface previews
router.put("/update", interfaceController.putInterface); // update data interface previews
router.delete("/delete", interfaceController.deleteInterface); // delete data interface previews
module.exports = router;
