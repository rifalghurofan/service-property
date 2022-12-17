const Type = require("../models/index").type_houses;
const Property = require("../models/index").properties;
const livePreviews = require("../models/index").live_previews;
const Spesification = require("../models/index").specifications;
const UnitFacilities = require("../models/index").unit_facilities;
const Furniture = require("../models/index").furnitures;
const Joi = require("joi");
const fs2 = require("fs-extra");
const fire = require("../services/firebase");
const storageRef = fire.storage().bucket();
const { uid } = require("uid");
const { Op } = require("sequelize");

const getTypes = async (req, res) => {
    const { id } = req.params;
    try {
        const types = await Type.findAll({
            where: { property_id: id },
        });
        res.status(200).json({
            status: "success",
            message: "get data type house previews",
            data: types,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};

const getTypeHouses = async (req, res) => {
    const { id } = req.params;
    const { client } = req.query;
    // get all type houses with property id
    try {
        Property.findOne({
            where: {
                uid: id,
            },
        })
            .then((result) => {
                if (result === null) {
                    res.status(404).json({
                        status: "error",
                        message: "property not found",
                    });
                } else {
                    Type.findAll({
                        where: {
                            property_id: result.id,
                        },
                        order: [["slot", "DESC"]],
                        raw: true,
                    })
                        .then(async (result2) => {
                            let data = [];
                            result2.forEach((item) => {
                                if (client === true) {
                                    if (
                                        item.dataValues.images !== null &&
                                        item.dataValues.images.length > 0
                                    ) {
                                        data.push(item);
                                    }
                                } else {
                                    data.push(item);
                                }
                            });
                            let newData = data.map(async (item) => {
                                const fasilitas = await UnitFacilities.findAll({
                                    where: {
                                        property_id: result.id,
                                    },
                                    raw: true,
                                });
                                item.unit_facilities = fasilitas[0];
                                const spesifikasi = await Spesification.findAll(
                                    {
                                        where: {
                                            property_id: result.id,
                                        },
                                        raw: true,
                                    }
                                );
                                item.specifications = spesifikasi[0];
                                console.log(item);
                                return item;
                            });

                            // data.forEach(async (item, key) => {
                            //     // get unit facilities with property id
                            //     await UnitFacilities.findAll({
                            //         where: {
                            //             property_id: result.id,
                            //         },
                            //     }).then((result3) => {
                            //         // update data with key
                            //         item.unit_facilities = result3;
                            //     });
                            //     // get spesification with property id
                            //     await Spesification.findAll({
                            //         where: {
                            //             property_id: result.id,
                            //         },
                            //     }).then((result5) => {
                            //         // update data with key
                            //         item.spesification = result5;
                            //     });
                            //     newData.push(item);
                            // });
                            Promise.all(newData).then((result) => {
                                res.status(200).json({
                                    status: "success",
                                    message: "get data type house previews",
                                    data: result,
                                });
                            });
                        })
                        .catch((error) => {
                            res.status(500).json({
                                status: "error",
                                message: error.message,
                            });
                        });
                }
            })
            .catch((error) => {
                res.status(500).json({
                    status: "error",
                    message: error.message,
                });
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};

const getTypeHouse = async (req, res) => {
    const { id, uid } = req.query;
    // get all type houses with property id
    try {
        const types = await Type.findAll({
            where: {
                property_id: id,
                uid: uid,
            },
        });
        // if type house not found
        if (types.length === 0) {
            res.status(404).json({
                status: "error",
                message: "type house not found",
            });
        } else {
            res.status(200).json({
                status: "success",
                message: "get data type house previews",
                data: types,
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};

const detailTipePerumahan = async (req, res) => {
    const { id, property_id } = req.params;
    const { client } = req.query;
    try {
        const id_prop = await Property.findOne({
            where: {
                uid: property_id,
            },
        });
        Type.findAll({
            where: { uid: id, property_id: id_prop.id },
            raw: true,
        }).then(async (result) => {
            let data = [];
            result.forEach((item) => {
                if (client === true) {
                    if (
                        item.dataValues.images !== null &&
                        item.dataValues.images.length > 0
                    ) {
                        data.push(item);
                    }
                } else {
                    data.push(item);
                }
            });
            let newData = data.map(async (item) => {
                const fasilitas = await UnitFacilities.findAll({
                    where: {
                        property_id: id_prop.id,
                    },
                    raw: true,
                });
                item.unit_facilities = fasilitas[0];
                const spesifikasi = await Spesification.findAll({
                    where: {
                        property_id: id_prop.id,
                    },
                    raw: true,
                });
                item.specifications = spesifikasi[0];
                const furnitures = await Furniture.findAll({
                    where: {
                        type_house_id: item.id,
                    },
                    raw: true,
                });
                item.furnitures =
                    furnitures[0] == undefined ? null : furnitures[0];
                console.log(item);
                return item;
            });
            Promise.all(newData).then((result) => {
                res.status(200).json({
                    status: "success",
                    message: "get data type house previews",
                    data: result[0],
                });
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};
const postTypes = async (req, res) => {
    try {
        const schema = Joi.object({
            property_id: Joi.string().required(),
            booking_fee: Joi.number().required().allow(null),
            name: Joi.string().required().allow(null),
            business: Joi.string().required().allow(null),
            color: Joi.string().required().allow(null),
            color_sold: Joi.string().required().allow(null),
            description: Joi.string().required().allow(null),
            other_business: Joi.string().required().allow(null),
            price: Joi.number().required().allow(null),
            property_type: Joi.string().required().allow(null),
            slot: Joi.number().required().allow(null),
            images: Joi.allow(null),
            id: Joi.allow(null),
            furnitures: Joi.allow(null),
            unit_facilities: Joi.string().required().allow(null),
            live_previews: Joi.string().required().allow(null),
        });
        const { error } = schema.validate(req.body);
        if (error) {
            console.log(error);
            res.status(400).json({
                type: error.details[0].type,
                message: error.details[0].message,
            });
        } else {
            const files = req.files;
            for (let i = 0; i < (files?.images.length ?? 0); i++) {
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
            const {
                property_id,
                booking_fee,
                name,
                business,
                color_sold,
                color,
                description,
                other_business,
                price,
                property_type,
                slot,
                unit_facilities,
                live_previews,
            } = req.body;

            const arrUnitFacilities = JSON.parse(unit_facilities);
            const arrLivePreviews = JSON.parse(live_previews);

            //Images
            let urlImages = [];
            const { directory } = req.body;
            for (let i = 0; i < (files?.images.length ?? 0); i++) {
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

            Property.findOne({
                where: {
                    uid: property_id,
                },
            }).then((result) => {
                Type.create({
                    uid: uid(32),
                    property_id: result.id,
                    booking_fee: booking_fee,
                    name: name,
                    business: business,
                    color: color,
                    color_sold: color_sold,
                    description: description,
                    images: urlImages,
                    other_business: other_business,
                    price: price,
                    property_type: property_type,
                    slot: slot,
                    unit_facilities: arrUnitFacilities,
                    live_previews: arrLivePreviews,
                    created_at: Date.now(),
                    updated_at: Date.now(),
                }).then((result2) => {
                    res.status(200).json({
                        status: "success",
                        message: "type house has been created",
                        data: result2,
                    });
                });
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
const putTypes = async (req, res) => {
    try {
        const { id, property_id } = req.params;
        const id_prop = await Property.findOne({
            where: {
                uid: property_id,
            },
        });
        const checkAvail = await Type.findOne({
            where: {
                uid: id,
                property_id: id_prop.id,
            },
        });
        if (checkAvail === null) {
            res.json({
                status: "Not found",
                messages: "Data types previews not found",
            });
        } else {
            const files = req.files;
            const {
                property_id,
                booking_fee,
                name,
                business,
                color,
                images,
                description,
                other_business,
                price,
                property_type,
                slot,
                unit_facilities,
                live_previews,
                spesification,
            } = req.body;

            console.log("booking fee : ", booking_fee);

            //Images
            const result = await Type.update(
                {
                    property_id: property_id,
                    booking_fee: booking_fee,
                    name: name,
                    business: business,
                    color: color,
                    description: description,
                    images: images,
                    other_business: other_business,
                    price: price,
                    property_type: property_type,
                    slot: slot,
                    updated_at: Date.now(),
                },
                {
                    where: { uid: id },
                    returning: true,
                }
            );
            await UnitFacilities.update(
                {
                    ...unit_facilities,
                    updated_at: Date.now(),
                },
                {
                    where: {
                        property_id: id_prop.id,
                    },
                    returning: true,
                }
            );
            if (result) {
                res.json({
                    status: "OK",
                    messages: "Data result successfully updated",
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
const deleteTypes = async (req, res) => {
    try {
        const id = req.query.id;
        const result = await Type.destroy({
            where: {
                uid: id,
            },
        });
        if (result === 0) {
            res.json({
                status: "Not found",
                messages: "Data types not found",
            });
        }
        if (result) {
            res.json({
                status: "OK",
                messages: "Data types successfully deleted",
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

const deleteTypeHouseAssets = async (req, res) => {
    const { id } = req.query;
    Type.findAll({}, { where: { property_id: id } }).then((data) => {
        data.forEach((element) => {
            const img = element.images;

            if (img) {
                const filenameImg = img[0].substring(60, 105);
                console.log(filenameImg);

                function deleteFile(filename) {
                    storageRef
                        .file(filename)
                        .delete()
                        .then(() => {
                            console.log("file dihapus!");
                        })
                        .catch((err) => {
                            console.log("file tidak ditemukan!");
                        });
                }
                deleteFile(filenameImg);
            }
        });
        Type.update(
            {
                images: null,
                updated_at: Date.now(),
            },
            { where: { property_id: id }, returning: true }
        ).then((data) => {
            res.json(data[1]);
        });
    });
};

module.exports = {
    getTypes,
    getTypeHouses,
    getTypeHouse,
    detailTipePerumahan,
    postTypes,
    putTypes,
    deleteTypes,
    deleteTypeHouseAssets,
};
