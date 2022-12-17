const livePreviews = require("../models/index").live_previews;
const Joi = require("joi");
const { where } = require("sequelize");
const { uid } = require("uid");

const getLive = async (req, res) => {
    try {
        const result = await livePreviews.findAll({});

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
const postLive = async (req, res) => {
    try {
        const schema = Joi.object({
            name: Joi.string().required(),
            url: Joi.string().required(),
        });
        const { error } = schema.validate(req.body);
        if (error)
            return res.status(400).json({
                type: error.details[0].type,
                message: error.details[0].message,
            });

        const { name, url } = req.body;
        const live = await livePreviews.create({
            uid: uid(32),
            name: name,
            url: url,
            created_at: Date.now(),
            updated_at: Date.now(),
        });
        if (live) {
            res.status(201).json({
                status: "OK",
                messages: "Data interface successfully added",
                data: live,
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
const putLive = async (req, res) => {
    try {
        const id = req.query.id;
        const checkAvail = await livePreviews.findOne({ where: { uid: id } });
        if (checkAvail === null) {
            res.json({
                status: "Not found",
                messages: "Data live previews not found",
            });
        } else {
            const { name, url } = req.body;
            const result = await livePreviews.update(
                {
                    name: name,
                    url: url,
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
const deleteLive = async (req, res) => {
    try {
        const id = req.query.id;
        const result = await livePreviews.destroy({
            where: {
                uid: id,
            },
        });
        if (result === 0) {
            res.json({
                status: "Not found",
                messages: "Data live not found",
            });
        }
        if (result) {
            res.json({
                status: "OK",
                messages: "Data live successfully deleted",
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
    getLive,
    postLive,
    putLive,
    deleteLive,
};
