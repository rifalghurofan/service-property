const Interface = require("../models/index").interfaceS;
const Joi = require("joi");
const { uid } = require("uid");

var json_data = require('../seeders/data/properties_prod-8-11-2022.json');

const readJson = async (req, res) => {
    try {
        res.json(json_data)
    } catch (error) {
        res.json(error)
    }
}

const getInterface = async (req, res) => {
    try {
        const result = await Interface.findAll({});

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
            data: {}
        });
    }
};
const postInterface = async (req, res) => {
    try {
        const schema = Joi.object({
            color: Joi.string().required(),
            height: Joi.number().required(),
            width: Joi.number().required(),
            offsets: Joi.string().required(),
            shape: Joi.string().required(),
            position_x: Joi.number().required(),
            position_y: Joi.number().required(),
        });

        const { error } = schema.validate(req.body);
        if (error)
            return res.status(400).json({
                type: error.details[0].type,
                message: error.details[0].message,
            });

        const { color, height, width, shape, position_x, position_y } =
            req.body;
        const offsets = JSON.parse(req.body.offsets);

        const interface = await Interface.create({
            uid: uid(32),
            color: color,
            height: height,
            width: width,
            offsets: offsets,
            shape: shape,
            position_x: position_x,
            position_y: position_y,
            created_at: Date.now(),
            updated_at: Date.now(),
        });
        if (interface) {
            res.status(201).json({
                status: "OK",
                messages: "Data interface successfully added",
                data: interface,
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
const putInterface = async (req, res) => {
    try {
        const id = req.query.id;
        const checkAvail = await Interface.findOne({
            where: {
                uid: id,
            },
        });
        if (checkAvail === null) {
            res.json({
                status: "Not found",
                messages: "Data Interface previews not found",
            });
        } else {
            const { color, height, width, shape, position_x, position_y } =
                req.body;
            const offsets = JSON.parse(req.body.offsets);
            const result = await Interface.update(
                {
                    color: color,
                    height: height,
                    width: width,
                    offsets: offsets,
                    shape: shape,
                    position_x: position_x,
                    position_y: position_y,
                    updated_at: Date.now(),
                },
                {
                    where: {
                        uid: id,
                    },
                }
            );

            if (result) {
                res.json({
                    status: "OK",
                    messages: "Data result successfully updated",
                    data: "Number of updated => " + result,
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
const deleteInterface = async (req, res) => {
    try {
        const id = req.query.id;
        const result = await Interface.destroy({
            where: {
                uid: id,
            },
        });
        if (result === 0) {
            res.json({
                status: "Not found",
                messages: "Data Interface not found",
            });
        }
        if (result) {
            res.json({
                status: "OK",
                messages: "Data Interface successfully deleted",
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

module.exports = {
    getInterface,
    postInterface,
    putInterface,
    deleteInterface,
    readJson
};
