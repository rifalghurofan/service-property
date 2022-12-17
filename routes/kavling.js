const express = require("express");
const multer = require("multer");
const multerService = require("../services/multer");
const addKavling = multer({ storage: multerService.addKavling });
const router = express.Router();
const kavlingsController = require("../controllers/kavlings.controller");

router.get("/ambilDaftarKavling", kavlingsController.getKavlings); // get data kavling previews
router.get("/ambilKavling", kavlingsController.getKavling); // get data kavling previews
router.get("/ambilDetailKavling", kavlingsController.getDetailKavling); // get data kavling previews
router.post(
    "/tambahKavling",
    addKavling.fields([
        { name: "images" },
        { name: "certificate", maxCount: 1 },
        { name: "certificates" },
    ]),
    kavlingsController.postKavlings
); // post data kavling previews
router.patch(
    "/editKavling/:property_id/:id",
    addKavling.fields([
        { name: "images" },
        { name: "certificate", maxCount: 1 },
        { name: "certificates" },
    ]),
    kavlingsController.putKavlings
); // update data kavling previews
router.delete(
    "/hapusKavling/:property_id/:id",
    kavlingsController.deleteKavlings
); // delete data kavling previews
router.delete("/resetKavling/:property_id", kavlingsController.resetKavlings); // reset data kavling previews")
module.exports = router;
