const express = require("express");
const router = express.Router();
const liveController = require("../controllers/live.controller");
const interfaceController = require("../controllers/interface.controller");
const siteplansController = require("../controllers/siteplans.controller");
const kavlingsController = require("../controllers/kavlings.controller");
const typeController = require("../controllers/type.controller");
const propertyController = require("../controllers/properties.controller");

router.get("/", async (req, res) => {
    try {
        res.json({
            status: "Success",
            message: "Halaman Home",
        });
    } catch (error) {
        res.json({
            status: "Error",
            message: error.message,
        });
    }
});

router.get("/live", liveController.getLive); // get data live previews
router.post("/live", liveController.postLive); // post data live previews
router.put("/live/:id", liveController.putLive); // update data live previews
router.delete("/live/:id", liveController.deleteLive); // delete data live previews

router.get("/interface", interfaceController.getInterface); // get data interface previews
router.post("/interface", interfaceController.postInterface); // post data interface previews
router.put("/interface/:id", interfaceController.putInterface); // update data interface previews
router.delete("/interface/:id", interfaceController.deleteInterface); // delete data interface previews

router.get("/siteplans", siteplansController.getSiteplans); // get data siteplans previews
router.post("/siteplans", siteplansController.postSiteplans); // post data siteplans previews
router.put("/siteplans/:id", siteplansController.putSiteplans); // update data siteplans previews
router.delete("/siteplans/:id", siteplansController.deleteSiteplans); // delete data siteplans previews

router.get("/kavling", kavlingsController.getKavlings); // get data kavling previews
router.post("/kavling", kavlingsController.postKavlings); // post data kavling previews
router.put("/kavling/:id", kavlingsController.putKavlings); // update data kavling previews
router.delete("/kavling/:id", kavlingsController.deleteKavlings); // delete data kavling previews

router.get("/type", typeController.getTypes); // get data type_house previews
router.get("/type/:id", typeController.detailTipePerumahan); // get data type_house previews
router.post("/type", typeController.postTypes); // post data type_house previews
router.put("/type/:id", typeController.putTypes); // update data type_house previews
router.delete("/type/:id", typeController.deleteTypes); // delete data type_house previews

router.get("/property", propertyController.getProperties); // get data property previews
router.get("/bookmark", propertyController.bookmark); // get data property previews by uids
router.get("/rekomendasiProperti", propertyController.rekomendasiProperti); // get rekomendasi property previews
router.get("/property/detail", propertyController.detailProperti); // get detail property previews
router.post("/tambahProperti", propertyController.tambahProperti); // post data property previews
router.put("/property/edit", propertyController.editProperti); // update data property previews
router.delete("/property/:id", propertyController.deleteProperties); // delete data property previews
router.get("/kelolaPropertiPrimer", propertyController.getPropertiesPrimer); // get data primary property
router.patch("/kelolaPropertiPrimer", propertyController.kelolaPropertiPrimer); // update data primary property
router.get("/property/filterKota", propertyController.filterKota); // get data property by kota
router.patch(
    "/kelolaPropertiSekunder",
    propertyController.kelolaPropertiSekunder
); // update data secondary property
module.exports = router;
