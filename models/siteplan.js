"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class siteplan extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    siteplan.init(
        {
            uid: {
                type: DataTypes.STRING,
                unique: true,
            },
            property_id: DataTypes.INTEGER,
            scale: DataTypes.FLOAT,
            font_size: DataTypes.FLOAT,
            image: DataTypes.TEXT,
            background: DataTypes.TEXT,
            x_coordinate: DataTypes.FLOAT,
            y_coordinate: DataTypes.FLOAT,
            z_coordinate: DataTypes.FLOAT,
        },
        {
            sequelize,
            modelName: "siteplan",
            timestamps: false,
        }
    );
    return siteplan;
};
