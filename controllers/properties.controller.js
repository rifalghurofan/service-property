const Property = require("../models/index").properties;
const Siteplan = require("../models/index").siteplan;
const Facilities = require("../models/index").unit_facilities;
const Spesification = require("../models/index").specifications;
const NearFacilities = require("../models/index").near_facilities;
const Joi = require("joi");
const fs2 = require("fs-extra");
const { uid } = require("uid");
const { Op } = require("sequelize");
const fire = require("../services/firebase");
const storageRef = fire.storage().bucket();

const options = {};

async function parseData(data) {
    let newData = data.map(async (item) => {
        const address = item.address;
        item.address = {};
        item.address.street = address;
        item.address.lower_city = item.lower_city;
        item.address.city = item.city;
        item.address.locality = item.locality;
        item.address.sublocality = item.sublocality;
        item.address.administrative_area = item.administrative_area;
        item.address.postal_code = item.postal_code;

        if (item.creator) {
            const creator = item.creator;
            item.creator = {};
            item.creator.id = creator;
        }

        const maps = item.maps;
        item.maps = {};
        item.maps.latitude = maps.split(",")[0];
        item.maps.longitude = maps.split(",")[1];

        // remove unused data
        delete item.city;
        delete item.locality;
        delete item.sublocality;
        delete item.administrative_area;
        delete item.postal_code;
        item.created_at = parseInt(item.created_at);
        item.updated_at = parseInt(item.updated_at);
        item.deleted_at = parseInt(item.deleted_at);

        return item;
    });
    return newData;
}

//GET
const getProperties = async (req, res) => {
    let { page = 1, limit = 15 } = req.query;
    limit = limit !== "null" ? limit : 15;
    let offset = ((page !== "null" ? page : 1) - 1) * limit;
    const { lower_city, categories, transaction } = req.body;
    try {
        const result = await Property.findAll({
            where: {
                // tolower lower_city
                lower_city: {
                    [Op.iLike]: `%${lower_city}%`,
                },
                categories: {
                    [Op.contains]: categories,
                },
                transaction: transaction,
            },
            limit: limit,
            offset: offset,
            include: [
                {
                    model: Siteplan,
                    as: "siteplan",
                },
                {
                    model: Spesification,
                    as: "specifications",
                },
                {
                    model: NearFacilities,
                    as: "near_facilities",
                },
            ],
        }).then(async (data) => {
            let newData = await parseData(data);
            // return res after all data is ready
            Promise.all(newData).then((result) => {
                if (result.length !== 0) {
                    res.status(200).json({
                        status: "SUCCESS",
                        messages: "Success get all data",
                        datacount: result.length,
                        data: result,
                    });
                } else {
                    res.status(200).json({
                        status: "SUCCESS",
                        messages: "No data found",
                        data: {},
                    });
                }
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "ERROR",
            messages: error.message,
            data: {},
        });
    }
};

const getOtherProperties = async (req, res) => {
    let { page = 1, limit = 15 } = req.query;
    limit = limit !== "null" ? limit : 15;
    let offset = ((page !== "null" ? page : 1) - 1) * limit;
    // get object named property
    const { lower_city, transaction, categories } = req.body;
    try {
        Property.findAll({
            where: {
                lower_city: {
                    [Op.iLike]: "%" + lower_city + "%",
                },
                transaction: transaction,
                categories: {
                    [Op.contains]: categories,
                },
            },
            limit: parseInt(limit),
            offset: offset,
        }).then(async (data) => {
            let newData = await parseData(data);
            // return res after all data is ready
            Promise.all(newData).then((result) => {
                res.status(200).json({
                    status: "OK",
                    messages: "Data properti berhasil didapatkan",
                    data: result,
                });
            });
        });
    } catch (err) {
        res.status(400).json({
            status: "ERROR",
            messages: err.message,
            data: {},
        });
    }
};

const searchProperties = async (req, res) => {
    let { page = 1, limit = 15 } = req.query;
    limit = limit !== "null" ? limit : 15;
    let offset = ((page !== "null" ? page : 1) - 1) * limit;
    const { search } = req.query;
    let options = {};
    if (search) {
        options = {
            where: {
                keywords: {
                    [Op.iLike]: `%${search}%`,
                },
            },
        };
    } else {
        options = {};
    }

    // if (["draft", "published", "archived", "deleted"].includes(search)) {
    //     options = {
    //         where: {
    //             status: search,
    //         },
    //     };
    // } else if (["primer", "seken"].includes(search)) {
    //     options = {
    //         where: {
    //             property_type: search,
    //         },
    //     };
    // } else {
    //     options = {
    //         where: {
    //             [Op.or]: [
    //                 { name: { [Op.iLike]: `%${search}%` } },
    //                 { address: { [Op.iLike]: `%${search}%` } },
    //                 { city: { [Op.iLike]: `%${search}%` } },
    //                 { locality: { [Op.iLike]: `%${search}%` } },
    //                 { sublocality: { [Op.iLike]: `%${search}%` } },
    //                 { administrative_area: { [Op.iLike]: `%${search}%` } },
    //                 { postal_code: { [Op.iLike]: `%${search}%` } },
    //             ],
    //         },
    //     };
    // }
    try {
        const result = await Property.findAll({
            ...options,
            limit: limit,
            offset: offset,
            include: [
                {
                    model: Siteplan,
                    as: "siteplan",
                },
                {
                    model: Spesification,
                    as: "specifications",
                },
                {
                    model: NearFacilities,
                    as: "near_facilities",
                },
            ],
        }).then(async (data) => {
            let newData = await parseData(data);
            // return res after all data is ready
            Promise.all(newData).then((result) => {
                if (result.length !== 0) {
                    res.status(200).json({
                        status: "SUCCESS",
                        messages: "Success get all data",
                        datacount: result.length,
                        data: result,
                    });
                } else {
                    res.status(200).json({
                        status: "SUCCESS",
                        messages: "No data found",
                        data: {},
                    });
                }
            });
        });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            messages: error.message,
            data: {},
        });
    }
};

const getUnauthorizedProperties = async (req, res) => {
    let { page = 1, limit = 15 } = req.query;
    limit = limit !== "null" ? limit : 15;
    let offset = ((page !== "null" ? page : 1) - 1) * limit;
    try {
        // get properties where developer_id is null
        const result = await Property.findAll({
            where: {
                developer_id: null,
            },
            limit: limit,
            offset: offset,
            include: [
                {
                    model: Siteplan,
                    as: "siteplan",
                },
                {
                    model: Spesification,
                    as: "specifications",
                },
                {
                    model: NearFacilities,
                    as: "near_facilities",
                },
            ],
        }).then(async (data) => {
            let newData = await parseData(data);
            // return res after all data is ready
            Promise.all(newData).then((result) => {
                if (result.length !== 0) {
                    res.status(200).json({
                        status: "SUCCESS",
                        messages: "Success get all data",
                        datacount: result.length,
                        data: result,
                    });
                } else {
                    res.status(200).json({
                        status: "SUCCESS",
                        messages: "No data found",
                        data: {},
                    });
                }
            });
        });
    } catch (error) {
        res.status(200).json({
            status: "ERROR",
            messages: error.message,
            data: {},
        });
    }
};

const getPropertiesFromDeveloper = async (req, res) => {
    let { page = 1, limit = 15 } = req.query;
    limit = limit !== "null" ? limit : 15;
    let offset = ((page !== "null" ? page : 1) - 1) * limit;
    try {
        const { id } = req.params;
        const result = await Property.findAll({
            where: {
                developer_id: id,
            },
            limit: limit,
            offset: offset,
            include: [
                {
                    model: Siteplan,
                    as: "siteplan",
                },
                {
                    model: Spesification,
                    as: "specifications",
                },
                {
                    model: NearFacilities,
                    as: "near_facilities",
                },
            ],
        }).then(async (data) => {
            let newData = await parseData(data);
            // return res after all data is ready
            Promise.all(newData).then((result) => {
                if (result.length !== 0) {
                    res.status(200).json({
                        status: "SUCCESS",
                        messages: "Success get all data",
                        datacount: result.length,
                        data: result,
                    });
                } else {
                    res.status(200).json({
                        status: "SUCCESS",
                        messages: "No data found",
                        data: {},
                    });
                }
            });
        });
    } catch (error) {
        res.status(400).json({
            status: "ERROR",
            messages: error.message,
            data: {},
        });
    }
};

const getPropertiesFromCity = async (req, res) => {
    let { page = 1, limit = 15 } = req.query;
    limit = limit !== "null" ? limit : 15;
    let offset = ((page !== "null" ? page : 1) - 1) * limit;
    try {
        const { city } = req.query;
        const result = await Property.findAll({
            where: {
                city: city,
            },
            limit: limit,
            offset: offset,
            include: [
                {
                    model: Siteplan,
                    as: "siteplan",
                },
                {
                    model: Spesification,
                    as: "specifications",
                },
                {
                    model: NearFacilities,
                    as: "near_facilities",
                },
            ],
        }).then(async (data) => {
            let newData = await parseData(data);
            // return res after all data is ready
            Promise.all(newData).then((result) => {
                if (result.length !== 0) {
                    res.status(200).json({
                        status: "SUCCESS",
                        messages: "Success get all data",
                        datacount: result.length,
                        data: result,
                    });
                } else {
                    res.status(200).json({
                        status: "SUCCESS",
                        messages: "No data found",
                        data: {},
                    });
                }
            });
        });
    } catch (error) {
        res.status(400).json({
            status: "ERROR",
            messages: error.message,
            data: {},
        });
    }
};

//GET UID
const bookmark = async (req, res) => {
    try {
        let uid = JSON.parse(req.body.uid);
        const result = [];
        for (let i = 0; i < uid.length; i++) {
            result[i] = await Property.findOne({ where: { uid: uid[i] } });
        }
        if (result.length !== 0) {
            res.json({
                status: "SUCCESS",
                messages: "Success get all data",
                datacount: result.length,
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

//REKOMENDASI PROPERTI
const rekomendasiProperti = async (req, res) => {
    try {
        const { lower_city } = req.body;
        const result = await Property.findAll({
            where: {
                lower_city: lower_city,
                status: "published",
            },
        });
        if (result.length !== 0) {
            res.json({
                status: "SUCCESS",
                messages: "Success get all data",
                datacount: result.length,
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

//GET ONE
const detailProperti = async (req, res) => {
    try {
        const id = req.params.id;
        // get result
        const result = await Property.findOne({
            where: { uid: id },
            include: [
                {
                    model: Siteplan,
                    as: "siteplan",
                },
                {
                    model: Spesification,
                    as: "specifications",
                },
                {
                    model: NearFacilities,
                    as: "near_facilities",
                },
            ],
        });
        if (result.length !== 0) {
            const address = result.address;
            result.address = {};
            result.address.street = address;
            result.address.city = result.city;
            result.address.locality = result.locality;
            result.address.sublocality = result.sublocality;
            result.address.administrative_area = result.administrative_area;
            result.address.postal_code = result.postal_code;

            result.near_facilities = [];
            await NearFacilities.findAll({
                raw: true,
                where: {
                    property_id: result.id,
                },
            }).then((data2) => {
                data2.map((result2) => {
                    delete result2.uid;
                    result2.createdAt = new Date(result2.createdAt).getTime();
                    result2.updatedAt = new Date(result2.updatedAt).getTime();
                });
                result.near_facilities = data2;
            });

            result.siteplan = {};
            await Siteplan.findAll({
                raw: true,
                where: {
                    property_id: result.id,
                },
            }).then((data) => {
                delete data.uid;
                data.createdAt = new Date(data.createdAt).getTime();
                data.updatedAt = new Date(data.updatedAt).getTime();
                result.siteplan = data[0];
            });

            if (result.creator) {
                const creator = result.creator;
                result.creator = {};
                result.creator.id = creator;
            }

            const maps = result.maps;
            result.maps = {};
            result.maps.latitude = maps.split(",")[0];
            result.maps.longitude = maps.split(",")[1];

            // remove unused data
            delete result.city;
            delete result.locality;
            delete result.sublocality;
            delete result.administrative_area;
            delete result.postal_code;

            // return res after all data is ready
            res.status(200).json({
                status: "success",
                messages: "success get data",
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

const uploadBrochure = async (req, res) => {
    const { uid } = req.body;
    try {
        const files = req.files;

        if (files.brochure[0].mimetype != "application/pdf") {
            res.json({
                status: "Not valid",
                msg: "File Brochure type must 'pdf'",
            });
        }

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
                        msg: "File Images[" + i + "] type must 'jpg/jpeg/png'",
                    });
                    stop();
            }
        }

        //Certificate
        let urlBrochure = "";
        const { directory } = req.body;
        const uploadBrochure = await storageRef.upload(files.brochure[0].path, {
            gzip: true,
            destination: `${directory}${files.brochure[0].filename}`,
        });
        await storageRef
            .file(uploadBrochure[0].name)
            .getSignedUrl({
                action: "read",
                expires: "03-09-2491",
            })
            .then((result) => {
                urlBrochure = result[0];
            })
            .catch((err) => {
                console.log(err);
            });
        // update data with brochure
        await Property.update(
            { brochure: urlBrochure },
            { where: { uid: uid } }
        );
        // response success
        res.json({
            status: "success",
            msg: "success upload brochure",
            data: {
                brochure: urlBrochure,
            },
        });
    } catch (error) {
        res.json({
            status: "ERROR",
            messages: error.message,
            data: {},
        });
    }
};

const uploadImage = async (req, res) => {
    const { uid } = req.body;
    try {
        const files = req.files;
        //Images
        let urlImages = "";
        const { directory } = req.body;
        const uploadImages = await storageRef.upload(files[i].path, {
            gzip: true,
            destination: `${directory}${files[i].filename}`,
        });

        await storageRef
            .file(uploadImages[0].name)
            .getSignedUrl({
                action: "read",
                expires: "03-09-2491",
            })
            .then((result) => {
                urlImages = result[0];
            })
            .catch((err) => {
                console.log(err);
            });

        // get property by uid
        const property = await Property.findOne({
            where: {
                uid: uid,
            },
        });
        // update data with images
        await Siteplan.update(
            { image: urlImages },
            { where: { property_id: property.id } }
        );
        // response success
        res.status(201).json({
            status: "success",
            msg: "success upload images",
            data: {
                images: urlImages,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "ERROR",
            messages: error.message,
            data: {},
        });
    }
};

const uploadImages = async (req, res) => {
    const schema = Joi.object({
        uid: Joi.string().required(),
        directory: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        console.log(error);
        return res.status(400).json({
            status: "error",
            message: error.details[0].message,
        });
    }
    const { uid, directory } = req.body;
    try {
        const files = req.files;
        //Images
        let urlImages = [];
        for (let i = 0; i < files.length; i++) {
            const uploadImages = await storageRef.upload(files[i].path, {
                gzip: true,
                destination: `${directory}${files[i].filename}`,
            });

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
        // response success
        res.status(201).json({
            status: "success",
            msg: "success upload images",
            data: {
                images: urlImages,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "ERROR",
            messages: error.message,
            data: {},
        });
    }
};

const uploadImageMap = async (req, res) => {
    const schema = Joi.object({
        uid: Joi.string().required(),
        directory: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        console.log(error);
        return res.status(400).json({
            status: "error",
            message: error.details[0].message,
        });
    }
    const { directory } = req.body;
    try {
        const files = req.files;
        console.log(files);
        let urlImageMap = [];
        //Images
        for (let i = 0; i < files.length; i++) {
            const uploadImages = await storageRef.upload(files[i].path, {
                gzip: true,
                destination: `${directory}${files[i].filename}`,
            });
            // get signed url
            await storageRef
                .file(uploadImages[0].name)
                .getSignedUrl({
                    action: "read",
                    expires: "03-09-2491",
                })
                .then((result) => {
                    urlImageMap = result[0];
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        // response success
        console.log(urlImageMap);
        res.json({
            status: "success",
            msg: "success upload image map",
            data: {
                image_map: urlImageMap,
            },
        });
    } catch (error) {
        res.json({
            status: "ERROR",
            messages: error.message,
            data: {},
        });
    }
};

//POST
const tambahProperti = async (req, res) => {
    try {
        const schema = Joi.object({
            address: Joi.object().required(),
            categories: Joi.array().required(), //array
            description: Joi.required(),
            developer: Joi.string().required().allow("", null),
            image_map: Joi.string().allow(null),
            index_priority: Joi.number().required(),
            is_secondary: Joi.required(),
            is_sold: Joi.required(),
            // keywords: Joi.string().required(),
            maps: Joi.object().required(),
            name: Joi.string().required(),
            near_facilities: Joi.array().required(), //
            panoramas: Joi.array().allow(null),
            payments: Joi.array().required(),
            property_type: Joi.required(),
            redirect_tender: Joi.required(),
            siteplan: Joi.object(), //
            status: Joi.required(),
            transaction: Joi.required(),
            spesification: Joi.object().required(), //

            // allow null
            developer_profile: Joi.object().allow(null),
            id: Joi.string().allow(null),
            image_map: Joi.string().allow(null),
            images: Joi.array().allow(null),
            updated_at: Joi.number().allow(null),
            is_draft: Joi.boolean().allow(null),
            certificates: Joi.array().allow(null),
            brochure: Joi.string().allow(null),
            creator: Joi.object().allow(null),
            listing_id: Joi.string().allow(null),
            selling_price: Joi.number().allow(null),
            rental_price: Joi.number().allow(null),
            sketch: Joi.string().allow(null),
            fee: Joi.number().allow(null),
            keywords: Joi.array().allow(null),
            linked_tender: Joi.string().allow(null),
        });
        const { error } = schema.validate(req.body);
        if (error) {
            console.log(error);
            return res.status(400).json({
                status: "error",
                message: error.details[0].message,
            });
        } else {
            let {
                address,
                categories,
                linked_tender, //bool
                creator,
                description,
                developer,
                fee,
                image_map,
                index_priority,
                is_secondary, //bool
                is_sold, //bool
                keywords,
                listing_id,
                maps,
                name,
                near_facilities,
                panoramas,
                payments,
                property_type,
                redirect_tender, //bool
                rental_price,
                selling_price,
                siteplan,
                sketch,
                status,
                transaction,
                spesification,
                type_house,
            } = req.body;
            const bool_is_sold = JSON.parse(is_sold);
            const bool_is_secondary = JSON.parse(is_secondary);
            const bool_linked_tender = JSON.parse(linked_tender);
            const bool_redirect_tender = JSON.parse(redirect_tender);
            // const arrKeywords = JSON.parse(keywords);

            const arrPanoramas = panoramas;
            const arrPayments = payments;
            const arrTypeHouses = type_house;

            let cat = [];
            for (let i = 0; i < categories.length; i++) {
                cat[i] = categories[i].name;
            }

            let KeywordsTEMP = [];
            if (keywords) {
                KeywordsTEMP = keywords;
            } else {
                let arrKeywordsTEMP = [];
                KeywordsTEMP[0] = categories;
                let count = 1;
                arrKeywordsTEMP = name.split(" ");
                for (let i = 0; i < arrKeywordsTEMP.length; i++) {
                    for (let e = 0; e < arrKeywordsTEMP[i].length; e++) {
                        KeywordsTEMP[count] = arrKeywordsTEMP[i].substring(
                            0,
                            e + 1
                        );
                        count++;
                    }
                }
            }
            let mapsTEMP = "";
            if (maps) {
                mapsTEMP = maps.latitude + "," + maps.longitude;
            }

            const addr = address;
            const {
                street,
                city,
                lower_city,
                locality,
                sublocality,
                administrative_area,
                postal_code,
            } = addr;
            const create = await Property.create({
                uid: uid(32),
                address: street,
                city: city,
                categories: categories,
                lower_city: lower_city,
                locality: locality,
                sublocality: sublocality,
                administrative_area: administrative_area,
                postal_code: postal_code,
                linked_tender: bool_linked_tender,
                creator: creator,
                description: description,
                developer: developer,
                fee: fee,
                image_map: image_map,
                index_priority: index_priority,
                is_secondary: bool_is_secondary,
                is_sold: bool_is_sold,
                keywords: KeywordsTEMP,
                listing_id: listing_id,
                maps: mapsTEMP,
                name: name,
                panoramas: arrPanoramas,
                payments: arrPayments,
                property_type: property_type,
                redirect_tender: bool_redirect_tender,
                rental_price: rental_price,
                selling_price: selling_price,
                siteplan_id: siteplan,
                sketch: sketch,
                status: status,
                transaction: transaction,
                type_house: arrTypeHouses,
                created_at: Date.now(),
                updated_at: Date.now(),
            });
            if (create) {
                // get id property
                const property = await Property.findOne({
                    where: { uid: create.uid },
                });
                // insert siteplan to db
                await Siteplan.create({
                    uid: uid(32),
                    property_id: property.id,
                    image: siteplan.image,
                    scale: siteplan.scale,
                    font_size: siteplan.font_size,
                    image: siteplan.image,
                    x_coordinate: siteplan.x_coordinate,
                    y_coordinate: siteplan.y_coordinate,
                    z_coordinate: siteplan.z_coordinate,
                    created_at: new Date().getTime(),
                    updated_at: new Date().getTime(),
                });

                // insert spesification facilities to db
                await Facilities.create({
                    uid: uid(32),
                    property_id: property.id,
                    garden: spesification.facilities.garden,
                    family_room: spesification.facilities.family_room,
                    living_room: spesification.facilities.living_room,
                    dining_room: spesification.facilities.dining_room,
                    kitchen: spesification.facilities.kitchen,
                    bathroom: spesification.facilities.bathroom,
                    carport: spesification.facilities.carport,
                    bedroom: spesification.facilities.bedroom,
                    land_area: spesification.facilities.land_area,
                    electricity: spesification.facilities.electricity,
                    certificate: spesification.facilities.certificate,
                    building_area: spesification.facilities.building_area,
                    soil_dimension: spesification.facilities.soil_dimension,
                    water_sources: spesification.facilities.water_sources,
                    maid_room: spesification.facilities.maid_room,
                    number_of_floor: spesification.facilities.number_of_floor,
                    roof_type: spesification.facilities.roof_type,
                    floor_type: spesification.facilities.floor_type,
                    garage: spesification.facilities.garage,
                    created_at: new Date().getTime(),
                    updated_at: new Date().getTime(),
                });
                // insert spesification to db
                await Spesification.create({
                    uid: uid(32),
                    property_id: property.id,
                    balcony: spesification.balcony,
                    front_porch: spesification.front_porch,
                    relationship_with_seller:
                        spesification.relationship_with_seller,
                    facing_building: spesification.facing_building,
                    front_road_width: spesification.front_road_width,
                    created_at: new Date().getTime(),
                    updated_at: new Date().getTime(),
                });

                // insert near facilities
                for (let i = 0; i < near_facilities.length; i++) {
                    await NearFacilities.create({
                        uid: uid(32),
                        property_id: property.id,
                        name: near_facilities[i].name,
                        mileage: near_facilities[i].mileage,
                        created_at: new Date().getTime(),
                        updated_at: new Date().getTime(),
                    });
                }
                res.status(201).json({
                    status: "OK",
                    messages: "Data interface successfully added",
                    data: create.uid,
                });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            message: "Server Error",
        });
    }
};

/// UPDATE
const editProperti = async (req, res) => {
    try {
        const id = req.params.id;
        const checkAvail = await Property.findOne({
            where: {
                uid: id,
            },
        });
        if (checkAvail === null) {
            res.json({
                status: "Not found",
                messages: "Data properties previews not found",
            });
        } else {
            const {
                address,
                brochure,
                categories,
                linked_tender, //bool
                creator,
                description,
                developer,
                fee,
                image_map,
                images,
                index_priority,
                is_secondary, //bool
                is_sold, //bool
                keywords,
                listing_id,
                maps,
                name,
                near_facilities,
                panoramas,
                payments,
                property_type,
                redirect_tender, //bool
                rental_price,
                selling_price,
                siteplan_id,
                siteplan,
                sketch,
                status,
                transaction,
                spesification_id,
                type_house,
            } = req.body;
            const bool_is_sold = JSON.parse(is_sold);
            const bool_is_secondary = JSON.parse(is_secondary);
            const bool_linked_tender = JSON.parse(linked_tender);
            const bool_redirect_tender = JSON.parse(redirect_tender);
            const arrKeywords = keywords;
            const arrPanoramas = panoramas;
            const arrPayments = payments;
            const arrTypeHouses = type_house;

            let mapsTEMP = "";
            if (maps) {
                mapsTEMP = maps.latitude + "," + maps.longitude;
            }

            const addr = address;
            const {
                street,
                city,
                lower_city,
                locality,
                sublocality,
                administrative_area,
                postal_code,
            } = addr;

            const put = await Property.update(
                {
                    address: street,
                    brochure: brochure,
                    categories: categories,
                    linked_tender: bool_linked_tender,
                    creator: creator,
                    description: description,
                    developer: developer,
                    fee: fee,
                    images: images,
                    image_map: image_map,
                    index_priority: index_priority,
                    is_secondary: bool_is_secondary,
                    is_sold: bool_is_sold,
                    keywords: arrKeywords,
                    listing_id: listing_id,
                    maps: mapsTEMP,
                    name: name,
                    near_facilities: near_facilities,
                    panoramas: arrPanoramas,
                    payments: arrPayments,
                    property_type: property_type,
                    redirect_tender: bool_redirect_tender,
                    rental_price: rental_price,
                    selling_price: selling_price,
                    siteplan_id: siteplan_id,
                    sketch: sketch,
                    status: status,
                    transaction: transaction,
                    spesification_id: spesification_id,
                    type_house: arrTypeHouses,
                    updated_at: Date.now(),
                },
                { where: { uid: id } }
            );

            if (put) {
                // get property with uid
                const property = await Property.findOne({
                    where: {
                        uid: id,
                    },
                });
                // update siteplan with property id
                await Siteplan.update(
                    {
                        ...siteplan,
                        updated_at: Date.now(),
                    },
                    { where: { property_id: property.id } }
                );
                res.status(200).json({
                    status: "OK",
                    messages: "Data property successfully updated",
                    data: put,
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

//DELETE
const hapusProperti = async (req, res) => {
    try {
        const id = req.params.id;
        // set status to archived
        const checkAvail = await Property.findOne({
            where: {
                uid: id,
            },
        });
        if (checkAvail === null) {
            res.status(404).json({
                status: "Not found",
                messages: "Data properties previews not found",
            });
        } else {
            const del = await Property.update(
                {
                    status: "archived",
                    updated_at: Date.now(),
                },
                { where: { uid: id } }
            );
            // delete all images from firebase
            // const images = checkAvail.images;
            // for (let i = 0; i < images.length; i++) {
            //     const image = images[i];
            //     const imageRef = storageRef.file(image);
            //     await imageRef.delete();
            // }
            if (del) {
                res.status(200).json({
                    status: "OK",
                    messages: "Data property successfully deleted",
                });
            }
        }
    } catch (err) {
        res.status(400).json({
            status: "ERROR",
            messages: err.message,
            data: {},
        });
    }
};

// show properti with primer type & pagination
const getPropertiesPrimer = async (req, res) => {
    try {
        let { page = 1, limit = 15, city } = req.query;
        limit = limit !== "null" ? limit : 15;
        let offset = ((page !== "null" ? page : 1) - 1) * limit;
        if (!city) {
            Property.findAll({
                where: {
                    property_type: "primer",
                },
                limit: parseInt(limit),
                offset: offset,
                order: [["created_at", "DESC"]],
                include: [
                    {
                        model: Siteplan,
                        as: "siteplan",
                    },
                    {
                        model: Spesification,
                        as: "specifications",
                    },
                    {
                        model: NearFacilities,
                        as: "near_facilities",
                    },
                ],
            }).then(async (data) => {
                let newData = await parseData(data);
                // return res after all data is ready
                Promise.all(newData).then((result) => {
                    res.json({
                        status: "OK",
                        messages:
                            "Data properties primer successfully retrieved",
                        data: result,
                    });
                });
            });
        } else {
            Property.findAll({
                where: {
                    property_type: "primer",
                    city: city,
                },
                limit: parseInt(limit),
                offset: offset,
                include: [
                    {
                        model: Siteplan,
                        as: "siteplan",
                    },
                    {
                        model: Spesification,
                        as: "specifications",
                    },
                    {
                        model: NearFacilities,
                        as: "near_facilities",
                    },
                ],
            }).then((data) => {
                let newData = parseData(data);
                Promise.all(newData).then((result) => {
                    res.json({
                        status: "OK",
                        messages:
                            "Data properties primer successfully retrieved",
                        data: result,
                    });
                });
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

const getPropertiesSeken = async (req, res) => {
    try {
        let { page = 1, limit = 15, city } = req.query;
        limit = limit !== "null" ? limit : 15;
        let offset = ((page !== "null" ? page : 1) - 1) * limit;
        if (!city) {
            Property.findAll({
                where: {
                    property_type: "seken",
                },
                limit: parseInt(limit),
                offset: offset,
                order: [["created_at", "DESC"]],
                include: [
                    {
                        model: Siteplan,
                        as: "siteplan",
                    },
                    {
                        model: Spesification,
                        as: "specifications",
                    },
                    {
                        model: NearFacilities,
                        as: "near_facilities",
                    },
                ],
            }).then(async (data) => {
                let newData = await parseData(data);
                // return res after all data is ready
                Promise.all(newData).then((result) => {
                    res.json({
                        status: "OK",
                        messages:
                            "Data properties primer successfully retrieved",
                        data: result,
                    });
                });
            });
        } else {
            Property.findAll({
                where: {
                    property_type: "seken",
                    city: city,
                },
                limit: parseInt(limit),
                offset: offset,
                include: [
                    {
                        model: Siteplan,
                        as: "siteplan",
                    },
                    {
                        model: Spesification,
                        as: "specifications",
                    },
                    {
                        model: NearFacilities,
                        as: "near_facilities",
                    },
                ],
            }).then((data) => {
                let newData = parseData(data);
                Promise.all(newData).then((result) => {
                    res.json({
                        status: "OK",
                        messages:
                            "Data properties primer successfully retrieved",
                        data: result,
                    });
                });
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

// kelola properti
const kelolaPropertiPrimer = async (req, res) => {
    const { id } = req.body;
    if (!id) {
        res.json({
            status: "ERROR",
            messages: "ID properti tidak boleh kosong",
            data: {},
        });
    }
    try {
        const data = await Property.findOne({
            where: {
                uid: id,
                property_type: "primer",
            },
        });
        if (data) {
            const {
                address,
                brochure,
                categories,
                creator,
                description,
                developer,
                fee,
                image_map,
                images,
                index_priority,
                is_secondary,
                is_sold,
                keywords,
                listing_id,
                maps,
                name,
                near_facilities,
                panoramas,
                payments,
                property_type,
                redirect_tender,
                rental_price,
                selling_price,
                siteplan_id,
                sketch,
                status,
                transaction,
                spesification_id,
                type_house,
            } = req.body;
            // update data properti
            Property.update(
                {
                    address: address,
                    categories: categories,
                    creator: creator,
                    description: description,
                    developer: developer,
                    fee: fee,
                    image_map: image_map,
                    index_priority: index_priority,
                    is_secondary: is_secondary,
                    is_sold: is_sold,
                    keywords: keywords,
                    listing_id: listing_id,
                    maps: maps,
                    name: name,
                    near_facilities: near_facilities,
                    panoramas: panoramas,
                    payments: payments,
                    property_type: property_type,
                    redirect_tender: redirect_tender,
                    rental_price: rental_price,
                    selling_price: selling_price,
                    siteplan_id: siteplan_id,
                    sketch: sketch,
                    status: status,
                    transaction: transaction,
                    spesification_id: spesification_id,
                    type_house: type_house,
                    updated_at: Date.now(),
                },
                {
                    where: { uid: id },
                    returning: true,
                }
            ).then((result) => [
                res.json({
                    status: "OK",
                    messages: "Data properti primer berhasil diupdate",
                    data: result[1],
                }),
            ]);
        } else {
            res.json({
                status: "Not found",
                messages:
                    "Data properti tidak ditemukan atau properti bukan primer",
                data: {},
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

// show data with city filter
const filterKota = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        const { kota } = req.query;
        if (!kota) {
            res.json({
                status: "ERROR",
                messages: "Kota tidak boleh kosong",
            });
        } else {
            Property.findAll({
                where: {
                    city: {
                        [Op.iLike]: "%" + kota + "%",
                    },
                },
                limit: parseInt(limit),
                offset: offset,
            }).then((data) => {
                res.json({
                    status: "OK",
                    messages: "Data properties successfully retrieved",
                    data: data,
                });
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

// kelola property sekunder
const kelolaPropertiSekunder = async (req, res) => {
    const { id } = req.body;
    if (!id) {
        res.json({
            status: "ERROR",
            messages: "ID properti tidak boleh kosong",
            data: {},
        });
    }
    try {
        const data = await Property.findOne({
            where: {
                uid: id,
                property_type: "seken",
            },
        });
        if (data) {
            const {
                address,
                categories,
                creator,
                description,
                developer,
                fee,
                image_map,
                index_priority,
                is_secondary,
                is_sold,
                keywords,
                listing_id,
                maps,
                name,
                near_facilities,
                panoramas,
                payments,
                property_type,
                redirect_tender,
                rental_price,
                selling_price,
                siteplan_id,
                sketch,
                status,
                transaction,
                spesification_id,
            } = req.body;
            // update data properti
            Property.update(
                {
                    address: address,
                    categories: categories,
                    creator: creator,
                    description: description,
                    developer: developer,
                    fee: fee,
                    image_map: image_map,
                    index_priority: index_priority,
                    is_secondary: is_secondary,
                    is_sold: is_sold,
                    keywords: keywords,
                    listing_id: listing_id,
                    maps: maps,
                    name: name,
                    near_facilities: near_facilities,
                    panoramas: panoramas,
                    payments: payments,
                    property_type: property_type,
                    redirect_tender: redirect_tender,
                    rental_price: rental_price,
                    selling_price: selling_price,
                    siteplan_id: siteplan_id,
                    sketch: sketch,
                    status: status,
                    transaction: transaction,
                    spesification_id: spesification_id,
                    updated_at: Date.now(),
                },
                {
                    where: { uid: id },
                    returning: true,
                }
            ).then((result) => [
                res.json({
                    status: "OK",
                    messages: "Data properti sekunder berhasil diupdate",
                    data: result[1],
                }),
            ]);
        } else {
            res.json({
                status: "Not found",
                messages:
                    "Data properti tidak ditemukan atau properti bukan sekunder",
                data: {},
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

const deleteImagesbyURL = async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) {
            res.json({
                status: "ERROR",
                messages: "URL tidak boleh kosong",
                data: {},
            });
        } else {
            const data = await Property.findOne({
                where: {
                    images: {
                        [Op.iLike]: "%" + url + "%",
                    },
                },
            });
            if (data) {
                const images = data.images;
                const newImages = images.filter((item) => item !== url);
                Property.update(
                    {
                        images: newImages,
                        updated_at: Date.now(),
                    },
                    {
                        where: { uid: data.uid },
                        returning: true,
                    }
                ).then((result) => [
                    res.json({
                        status: "OK",
                        messages: "Gambar berhasil dihapus",
                        data: result[1],
                    }),
                ]);
            } else {
                res.json({
                    status: "Not found",
                    messages: "Data properti tidak ditemukan",
                    data: {},
                });
            }
        }
    } catch (err) {
        res.status(400).json({
            status: "ERROR",
            messages: err.message,
            data: {},
        });
    }
};

const deletePropertyAsset = async (req, res) => {
    // delete firebase folder
    const { directory } = req.query;
    if (!directory) {
        res.status(400).json({
            status: "ERROR",
            messages: "Directory tidak boleh kosong",
            data: {},
        });
    } else {
        const bucket = admin.storage().bucket();
        const file = bucket.file(directory);
        file.delete().then(() => {
            res.json({
                status: "OK",
                messages: "Asset berhasil dihapus",
                data: {},
            });
        });
    }
};

module.exports = {
    getProperties,
    searchProperties,
    getUnauthorizedProperties,
    getPropertiesFromDeveloper,
    getPropertiesFromCity,
    bookmark,
    detailProperti,
    uploadBrochure,
    uploadImages,
    uploadImage,
    uploadImageMap,
    tambahProperti,
    editProperti,
    hapusProperti,
    rekomendasiProperti,
    getPropertiesPrimer,
    getPropertiesSeken,
    kelolaPropertiPrimer,
    filterKota,
    kelolaPropertiSekunder,
    deleteImagesbyURL,
    deletePropertyAsset,
    getOtherProperties,
};
