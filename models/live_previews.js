"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class live_previews extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    live_previews.init(
        {
            uid: {
                type: DataTypes.STRING,
                unique: true
            },
            name: DataTypes.STRING,
            url: DataTypes.STRING,
            created_at: DataTypes.BIGINT,
            updated_at: DataTypes.BIGINT,
        },
        {
            sequelize,
            modelName: "live_previews",
            timestamps: false,
        }
    );
    return live_previews;
};
