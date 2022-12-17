const express = require("express");
const multer = require("multer");
const multerService = require("../services/multer");
const addProperty = multer({ storage: multerService.addProperty });
const router = express.Router();
const propertyController = require("../controllers/properties.controller");

router.get("/ambilProperti", propertyController.getProperties); // get data property previews
router.get("/cariProperti", propertyController.searchProperties); // get search data property previews
router.get(
    "/ambilPropertiNonDeveloper",
    propertyController.getUnauthorizedProperties
); // get data with unauthorized
router.get(
    "/ambilPropertiDeveloper/:id",
    propertyController.getPropertiesFromDeveloper
); // get data with my properties")
router.get("/ambilPropertiDariKota", propertyController.getPropertiesFromCity); // get data with my properties")
router.get("/bookmark", propertyController.bookmark); // get data property previews by uids
router.get("/rekomendasiProperti", propertyController.rekomendasiProperti); // get rekomendasi property previews
router.get("/detailProperti/:id", propertyController.detailProperti); // get detail property previews
router.post("/tambahProperti", propertyController.tambahProperti); // post data property previews
router.post(
    "/uploadBrochure",
    addProperty.single("brochure"),
    propertyController.uploadBrochure
);
router.post(
    "/uploadDaftarGambarProperti",
    addProperty.any("daftar_gambar"),
    propertyController.uploadImages
);
router.post(
    "/uploadGambarProperti",
    addProperty.any("gambar"),
    propertyController.uploadImageMap
);
router.post("/ambilPropertiLainnya", propertyController.getOtherProperties);
router.patch("/editProperti/:id", propertyController.editProperti); // update data property previews
router.delete("/hapusProperti/:id", propertyController.hapusProperti); // delete data property previews
router.get("/kelolaPropertiPrimer", propertyController.getPropertiesPrimer); // get data primary property
router.patch("/kelolaPropertiPrimer", propertyController.kelolaPropertiPrimer); // update data primary property
router.get("/kelolaPropertiSeken", propertyController.getPropertiesSeken); // get data seken property')
router.patch("/kelolaPropertiSeken", propertyController.kelolaPropertiSekunder); // update data seken property')
router.delete("/hapusGambarProperti", propertyController.deleteImagesbyURL); // delete data property previews
router.delete("/hapusFolderAsset", propertyController.deletePropertyAsset); // delete data property previews")

module.exports = router;
