const express = require("express");
const router = express.Router();
const multer = require("multer");
const multerService = require("../services/multer");
const addSiteplan = multer({ storage: multerService.addSiteplan });
const siteplansController = require("../controllers/siteplans.controller");

router.get("/", siteplansController.getSiteplans); // get data siteplans previews
router.post(
    "/add",
    addSiteplan.fields([
        { name: "image", maxCount: 1 },
        { name: "background", maxCount: 1 },
    ]),
    siteplansController.postSiteplans
); // post data siteplans previews
router.put(
    "/update",
    addSiteplan.fields([
        { name: "image", maxCount: 1 },
        { name: "background", maxCount: 1 },
    ]),
    siteplansController.putSiteplans
); // update data siteplans previews
router.delete("/delete", siteplansController.deleteSiteplans); // delete data siteplans previews
router.delete(
    "/deleteSiteplanAssets",
    siteplansController.deleteSiteplanAssets
); // delete data siteplans previews

module.exports = router;
