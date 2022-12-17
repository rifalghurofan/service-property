const Kavling = require("../models/index").kavlings;
const TypeHouse = require("../models/index").type_houses;
const Property = require("../models/index").properties;
const Interface = require("../models/index").interfaceS;
const Joi = require("joi");
const fs2 = require("fs-extra");
const { uid } = require("uid");
const fire = require("../services/firebase");
const kavlings = require("../models/kavlings");
const storageRef = fire.storage().bucket();

//GET KAVLINGS
const getKavlings = async (req, res) => {
    try {
        const result = await Kavling.findAll();

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
        console.log(error);
        res.json({
            status: "ERROR",
            messages: error.message,
            data: {},
        });
    }
};

const getKavling = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Kavling.findOne({
            where: { property_id: id },
        });

        if (result.length !== 0) {
            res.status(200).json({
                status: "SUCCESS",
                messages: "Success get all data",
                data: result,
            });
        } else {
            res.status(200).json({
                status: "SUCCESS",
                messages: "No data found",
                data: {},
            });
        }
    } catch (error) {
        res.status(400).json({
            status: "ERROR",
            messages: error.message,
            data: {},
        });
    }
};

//POST KAVLINGS
const postKavlings = async (req, res) => {
    try {
        const schema = Joi.object({
            type_house: Joi.allow(null),
            is_sold: Joi.boolean().allow(null),
            interface: Joi.allow(null),
            id: Joi.allow(null),
            images: Joi.allow(null),
            certificate: Joi.allow(null),
            certificates: Joi.allow(null),
            property_id: Joi.string().allow(null),
            block: Joi.string().allow(null, ""),
            cluster: Joi.string().allow(null, ""),
        });
        console.log(req.body);
        const { error } = schema.validate(req.body);
        if (error) {
            console.log(error);
            res.status(400).json({
                type: error.details[0].type,
                message: error.details[0].message,
            });
        } else {
            const files = req.files;
            //Certificates
            let urlCertificates = [];
            //Images
            let urlImages = [];
            //Certificate
            let urlCertificate = "";
            const { property_id, block, cluster } = req.body;

            if (files?.certificate) {
                for (let i = 0; i < files.certificate.length; i++) {
                    switch (files.certificate[0].mimetype) {
                        case "image/png":
                            break;
                        case "image/jpg":
                            break;
                        case "image/jpeg":
                            break;
                        default:
                            fs2.emptyDirSync("uploads/kavling");
                            res.json({
                                status: "Not valid",
                                msg:
                                    "File certificate[" +
                                    i +
                                    "] type must 'jpg/jpeg/png'",
                            });
                            stop();
                    }
                }
                const directory = `kavling/${uid(10)}/`;
                const uploadCertificate = await storageRef.upload(
                    files.certificate[0].path,
                    {
                        gzip: true,
                        destination: `${directory}${files.certificate[0].filename}`,
                    }
                );
                await storageRef
                    .file(uploadCertificate[0].name)
                    .getSignedUrl({
                        action: "read",
                        expires: "03-09-2491",
                    })
                    .then((result) => {
                        urlCertificate = result[0];
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
            if (files?.certificates) {
                const directory = `kavling/${uid(10)}/`;
                for (let i = 0; i < files.certificates.length; i++) {
                    switch (files.certificates[i].mimetype) {
                        case "image/png":
                            break;
                        case "image/jpg":
                            break;
                        case "image/jpeg":
                            break;
                        default:
                            fs2.emptyDirSync("uploads/kavling");
                            res.json({
                                status: "Not valid",
                                msg:
                                    "File certificates[" +
                                    i +
                                    "] type must 'jpg/jpeg/png'",
                            });
                            stop();
                    }
                }

                for (let i = 0; i < files.certificates.length; i++) {
                    const uploadCertificates = await storageRef.upload(
                        files.certificates[i].path,
                        {
                            gzip: true,
                            destination: `${directory}${files.certificates[i].filename}`,
                        }
                    );
                    await storageRef
                        .file(uploadCertificates[0].name)
                        .getSignedUrl({
                            action: "read",
                            expires: "03-09-2491",
                        })
                        .then((result) => {
                            urlCertificates[i] = result[0];
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            }
            if (files?.images) {
                for (let i = 0; i < files.images.length; i++) {
                    switch (files.images[i].mimetype) {
                        case "image/png":
                            break;
                        case "image/jpg":
                            break;
                        case "image/jpeg":
                            break;
                        default:
                            fs2.emptyDirSync("uploads/kavling");
                            res.json({
                                status: "Not valid",
                                msg:
                                    "File Images[" +
                                    i +
                                    "] type must 'jpg/jpeg/png'",
                            });
                            stop();
                    }
                }
                const directory = `kavling/${uid(10)}/`;
                for (let i = 0; i < files.images.length; i++) {
                    const uploadImages = await storageRef.upload(
                        files.images[i].path,
                        {
                            gzip: true,
                            destination: `${directory}${files.images[i].filename}`,
                        }
                    );

                    await storageRef
                        .file(uploadImages[0].name)
                        .getSignedUrl({
                            action: "read",
                            expires: "03-09-2491",
                        })
                        .then((result) => {
                            urlImages[i] = result[0];
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            }
            // get id by property_id
            Property.findOne({
                where: { uid: property_id },
            }).then(async (result) => {
                // fs2.emptyDirSync("uploads");
                const kavlings = await Kavling.create({
                    uid: uid(32),
                    property_id: property_id,
                    block: block,
                    certificate: urlCertificate[0],
                    certificates: urlCertificates,
                    cluster: cluster,
                    images: urlImages,
                    created_at: Date.now(),
                    updated_at: Date.now(),
                });
                if (kavlings) {
                    res.status(201).json({
                        status: "OK",
                        messages: "Data kavlings successfully added",
                        data: kavlings,
                    });
                }
            });
        }
    } catch (error) {
        console.log(error);
        res.json({
            status: "ERROR",
            messages: error.message,
            data: {},
        });
    }
};

//UPDATE KAVLINGS
const putKavlings = async (req, res) => {
    try {
        const { property_id, id } = req.params;
        const checkAvail = await Kavling.findOne({
            where: {
                property_id: property_id,
                uid: id,
            },
        });

        if (checkAvail === null) {
            res.json({
                status: "Not found",
                messages: "Data kavlings previews not found",
            });
        } else {
            const files = req.files;

            for (let i = 0; i < files.images.length; i++) {
                switch (files.images[i].mimetype) {
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
                            msg:
                                "File Images[" +
                                i +
                                "] type must 'jpg/jpeg/png'",
                        });
                        stop();
                }
            }
            const { property_id, block, cluster, interface_id, type_house_id } =
                req.body;

            //Images
            let urlImages = [];
            const { directory } = req.body;
            for (let i = 0; i < files.images.length; i++) {
                const uploadImages = await storageRef.upload(
                    files.images[i].path,
                    {
                        gzip: true,
                        destination: `${directory}${files.images[i].filename}`,
                    }
                );

                storageRef
                    .file(uploadImages[0].name)
                    .getSignedUrl({
                        action: "read",
                        expires: "03-09-2491",
                    })
                    .then((result) => {
                        urlImages[i] = result[0];
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
            //Certificate
            let urlCertificate = "";
            const uploadCertificate = await storageRef.upload(
                files.certificate[0].path,
                {
                    gzip: true,
                    destination: `${directory}${files.certificate[0].filename}`,
                }
            );
            storageRef
                .file(uploadCertificate[0].name)
                .getSignedUrl({
                    action: "read",
                    expires: "03-09-2491",
                })
                .then((result) => {
                    urlCertificate = result;
                })
                .catch((err) => {
                    console.log(err);
                });

            //Certificates
            let urlCertificates = [];
            for (let i = 0; i < files.certificates.length; i++) {
                const uploadCertificates = await storageRef.upload(
                    files.certificates[i].path,
                    {
                        gzip: true,
                        destination: `${directory}${files.certificates[i].filename}`,
                    }
                );
                storageRef
                    .file(uploadCertificates[0].name)
                    .getSignedUrl({
                        action: "read",
                        expires: "03-09-2491",
                    })
                    .then((result) => {
                        urlCertificates[i] = result[0];
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }

            const result = await Kavling.update(
                {
                    property_id: property_id,
                    block: block,
                    certificate: urlCertificate,
                    certificates: urlCertificates,
                    cluster: cluster,
                    images: urlImages,
                    interface_id: interface_id,
                    type_house_id: type_house_id,
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
                    messages: "Data result successfully updated",
                    data: result,
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

// DELETE KAVLINGS
const deleteKavlings = async (req, res) => {
    try {
        const { property_id, id } = req.params;
        const result = await Kavling.destroy({
            where: {
                property_id: property_id,
                uid: id,
            },
        });
        if (result === 0) {
            res.json({
                status: "Not found",
                messages: "Data kavlings not found",
            });
        }
        if (result) {
            res.json({
                status: "OK",
                messages: `data kavling with id ${id} and property_id ${property_id} successfully deleted`,
                data: "Number of deleted => " + result,
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

const resetKavlings = async (req, res) => {
    const { property_id } = req.params;
    try {
        const result = await Kavling.destroy({
            where: {
                property_id: property_id,
            },
        });
        if (result === 0) {
            res.json({
                status: "Not found",
                messages: "Data kavlings not found",
            });
        }
        if (result) {
            res.json({
                status: "OK",
                messages: `data kavlings with property_id ${property_id} successfully deleted`,
                data: "Number of deleted => " + result,
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

const getDetailKavling = async (req, res) => {
    const { id, property_id } = req.query;
    try {
        const result = await Kavling.findOne({
            where: {
                id : id,
                property_id: property_id,
            },
        });

        if (result.length !== 0) {
            res.status(200).json({
                status: "SUCCESS",
                messages: "Success get data",
                data: result,
            });
        } else {
            res.status(200).json({
                status: "SUCCESS",
                messages: "No data found",
                data: {},
            });
        }
    } catch (error) {
        res.status(400).json({
            status: "ERROR",
            messages: error.message,
            data: {},
        });
    }
}

module.exports = {
    getKavlings,
    getKavling,
    getDetailKavling,
    postKavlings,
    putKavlings,
    deleteKavlings,
    resetKavlings,
};
