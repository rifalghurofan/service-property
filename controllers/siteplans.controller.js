const Siteplan = require("../models/index").siteplan;
const Property = require("../models/index").properties;
const Joi = require("joi");
const fs2 = require("fs-extra");
const fire = require("../services/firebase");
const storageRef = fire.storage().bucket();

const { uid } = require("uid");

const getSiteplans = async (req, res) => {
    try {
        const result = await Siteplan.findAll({ include: Property });

        if (result.length !== 0) {
            res.json({
                status: "SUCCESS",
                messages: "Success get all data",
                data: result,
            });
        } else {
            res.json({
                status: "SUCCESS",
                messages: "No data found",
                data: {},
            });
        }
    } catch (error) {
        res.json({
            status: "ERROR",
            messages: error.message,
            data: {},
        });
    }
};
const postSiteplans = async (req, res) => {
    try {
        const schema = Joi.object({
            property_id: Joi.string().required(),
            scale: Joi.number().required(),
            font_size: Joi.required(),
            x_coordinate: Joi.number().required(),
            y_coordinate: Joi.number().required(),
            z_coordinate: Joi.number().required(),
        });
        const { error } = schema.validate(req.body);
        if (error)
            return res.status(400).json({
                type: error.details[0].type,
                message: error.details[0].message,
            });
        const {
            property_id,
            scale,
            font_size,
            // background, image
            x_coordinate,
            y_coordinate,
            z_coordinate,
        } = req.body;

        const files = req.files;
        switch (files.background[0].mimetype) {
            case "image/png":
                break;
            case "image/jpg":
                break;
            case "image/jpeg":
                break;
            default:
                fs2.emptyDirSync("uploads");
                res.json({
                    status: "Not valid",
                    msg: "File Images[" + i + "] type must 'jpg/jpeg/png'",
                });
                stop();
        }
        switch (files.image[0].mimetype) {
            case "image/png":
                break;
            case "image/jpg":
                break;
            case "image/jpeg":
                break;
            default:
                fs2.emptyDirSync("uploads");
                res.json({
                    status: "Not valid",
                    msg: "File Images[" + i + "] type must 'jpg/jpeg/png'",
                });
                stop();
        }

        //Image
        let urlImage = "";
        const { directory } = req.body;
        const uploadImage = await storageRef.upload(files.image[0].path, {
            gzip: true,
            destination: `${directory}${files.image[0].filename}`,
        });
        await storageRef
            .file(uploadImage[0].name)
            .getSignedUrl({
                action: "read",
                expires: "03-09-2491",
            })
            .then((result) => {
                urlImage = result[0];
            })
            .catch((err) => {
                console.log(err);
            });
        //Background
        let urlBackground = "";
        const uploadBackground = await storageRef.upload(
            files.background[0].path,
            {
                gzip: true,
                destination: `${directory}${files.background[0].filename}`,
            }
        );
        await storageRef
            .file(uploadBackground[0].name)
            .getSignedUrl({
                action: "read",
                expires: "03-09-2491",
            })
            .then((result) => {
                urlBackground = result[0];
            })
            .catch((err) => {
                console.log(err);
            });

        const siteplans = await Siteplan.create({
            uid: uid(32),
            property_id: property_id,
            scale: scale,
            font_size: font_size,
            image: urlImage,
            background: urlBackground,
            x_coordinate: x_coordinate,
            y_coordinate: y_coordinate,
            z_coordinate: z_coordinate,
            created_at: Date.now(),
            updated_at: Date.now(),
        });
        if (siteplans) {
            res.status(201).json({
                status: "OK",
                messages: "Data interface successfully added",
                data: siteplans,
            });
        }
    } catch (error) {
        res.json({
            status: "ERROR",
            messages: error.message,
            data: {},
        });
    }
};
const putSiteplans = async (req, res) => {
    try {
        const id = req.query.id;
        const checkAvail = await Siteplan.findOne({
            where: {
                uid: id,
            },
        });
        if (checkAvail === null) {
            res.json({
                status: "Not found",
                messages: "Data siteplans previews not found",
            });
        } else {
            const {
                property_id,
                scale,
                font_size,
                x_coordinate,
                y_coordinate,
                z_coordinate,
            } = req.body;

            const files = req.files;
            switch (files.background[0].mimetype) {
                case "image/png":
                    break;
                case "image/jpg":
                    break;
                case "image/jpeg":
                    break;
                default:
                    fs2.emptyDirSync("uploads");
                    res.json({
                        status: "Not valid",
                        msg: "File Images[" + i + "] type must 'jpg/jpeg/png'",
                    });
                    stop();
            }
            switch (files.image[0].mimetype) {
                case "image/png":
                    break;
                case "image/jpg":
                    break;
                case "image/jpeg":
                    break;
                default:
                    fs2.emptyDirSync("uploads");
                    res.json({
                        status: "Not valid",
                        msg: "File Images[" + i + "] type must 'jpg/jpeg/png'",
                    });
                    stop();
            }

            //Image
            let urlImage = "";
            const { directory } = req.body;
            const uploadImage = await storageRef.upload(files.image[0].path, {
                gzip: true,
                destination: `${directory}${files.image[0].filename}`,
            });
            await storageRef
                .file(uploadImage[0].name)
                .getSignedUrl({
                    action: "read",
                    expires: "03-09-2491",
                })
                .then((result) => {
                    urlImage = result[0];
                })
                .catch((err) => {
                    console.log(err);
                });
            //Background
            let urlBackground = "";
            const uploadBackground = await storageRef.upload(
                files.background[0].path,
                {
                    gzip: true,
                    destination: `${directory}${files.background[0].filename}`,
                }
            );
            await storageRef
                .file(uploadBackground[0].name)
                .getSignedUrl({
                    action: "read",
                    expires: "03-09-2491",
                })
                .then((result) => {
                    urlBackground = result[0];
                })
                .catch((err) => {
                    console.log(err);
                });
            const result = await Siteplan.update(
                {
                    property_id: property_id,
                    scale: scale,
                    font_size: font_size,
                    image: urlImage,
                    background: urlBackground,
                    x_coordinate: x_coordinate,
                    y_coordinate: y_coordinate,
                    z_coordinate: z_coordinate,
                    updated_at: Date.now(),
                },
                {
                    where: { uid: id },
                    returning: true,
                }
            );

            if (result) {
                res.json({
                    status: "OK",
                    messages: "Data siteplans successfully updated",
                    data: result[1],
                });
            }
        }
    } catch (error) {
        res.json({
            status: "ERROR",
            messages: error.message,
            data: {},
        });
    }
};
const deleteSiteplans = async (req, res) => {
    try {
        const id = req.query.id;
        const result = await Siteplan.destroy({
            where: {
                uid: id,
            },
        });
        if (result === 0) {
            res.json({
                status: "Not found",
                messages: "Data siteplans not found",
            });
        }
        if (result) {
            res.json({
                status: "OK",
                messages: "Data siteplans successfully deleted",
            });
        }
    } catch (err) {
        res.status(400).json({
            status: "ERROR",
            messages: err.message,
            data: {},
        });
    }
};

const deleteSiteplanAssets = async (req, res) => {
    const id = req.query.id;
    Siteplan.findAll({ where: { property_id: id } }).then((data) => {
        data.forEach((element) => {
            const img = element.image;
            const bg = element.background;

            if (img && bg) {
                const filenameImg = img[0].substring(60, 105);
                const filenameBg = bg[0].substring(60, 105);
                console.log(filenameImg);
                console.log(filenameBg);

                function deleteFile(filename) {
                    storageRef
                        .file(filename)
                        .delete()
                        .then(() => {
                            console.log("file deleted!");
                        })
                        .catch((err) => {
                            console.log("file not found!");
                        });
                }
                deleteFile(filenameImg);
                deleteFile(filenameBg);
            }
        });
        Siteplan.update(
            {
                image: null,
                background: null,
                updated_at: Date.now(),
            },
            { where: { property_id: id }, returning: true }
        ).then((data) => {
            res.json({
                status: "SUCCESS",
                messages: "Image file deleted",
                data: data[1],
            });
        });
    });
};

module.exports = {
    getSiteplans,
    postSiteplans,
    putSiteplans,
    deleteSiteplans,
    deleteSiteplanAssets,
};
