const express = require("express");
const multer = require("multer");
const multerService = require("../services/multer");
const addTypehouse = multer({ storage: multerService.addTypehouse });
const router = express.Router();
const typeController = require("../controllers/type.controller");

router.get("/", typeController.getTypes);
router.get("/ambilDaftarTipeRumah/:id", typeController.getTypeHouses);
router.get("/ambilDataTipeRumah", typeController.getTypeHouse);
router.get("kelolaTipePropertiPrimer/:id/typeHouses", typeController.getTypes); // get data type_house previews
router.get(
    "/ambilTipeRumah/:property_id/:id",
    typeController.detailTipePerumahan
); // get data type_house previews
router.post(
    "/tambahTipeRumah",
    addTypehouse.fields([{ name: "images" }]),
    typeController.postTypes
); // post data type_house previews
router.patch(
    "/editTipeRumah/:property_id/:id",
    addTypehouse.fields([{ name: "images" }]),
    typeController.putTypes
); // update data type_house previews
router.delete("/hapusTipeRumah", typeController.deleteTypes); // delete data type_house previews

module.exports = router;
