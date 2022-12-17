const multer = require("multer");
const path = require("path");
const { uid } = require("uid");
const fs = require("fs");

let multerService = {
    addKavling: multer.diskStorage({
        destination: function (req, file, callback) {
            const pathKavling = "./public/uploads/kavling";
            fs.mkdirSync(pathKavling, { recursive: true });
            callback(null, pathKavling);
        },
        filename: function (req, file, callback) {
            callback(null, uid(32) + path.extname(file.originalname));
        },
    }),
    addProperty: multer.diskStorage({
        destination: function (req, file, callback) {
            const pathProperty = "./public/uploads/property";
            fs.mkdirSync(pathProperty, { recursive: true });
            callback(null, pathProperty);
        },
        filename: function (req, file, callback) {
            callback(null, uid(32) + path.extname(file.originalname));
        },
    }),
    addSiteplan: multer.diskStorage({
        destination: function (req, file, callback) {
            const pathSiteplan = "./public/uploads/siteplan";
            fs.mkdirSync(pathSiteplan, { recursive: true });
            callback(null, pathSiteplan);
        },
        filename: function (req, file, callback) {
            callback(null, uid(32) + path.extname(file.originalname));
        },
    }),
    addTypehouse: multer.diskStorage({
        destination: function (req, file, callback) {
            const pathTypehouse = "./public/uploads/typehouse";
            fs.mkdirSync(pathTypehouse, { recursive: true });
            callback(null, pathTypehouse);
        },
        filename: function (req, file, callback) {
            callback(null, uid(32) + path.extname(file.originalname));
        },
    }),
};
module.exports = multerService;
