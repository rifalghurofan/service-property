"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class interfaces extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    interfaces.init(
        {
            uid: DataTypes.STRING,
            kavling_id: DataTypes.INTEGER,
            color: DataTypes.STRING,
            height: DataTypes.FLOAT,
            width: DataTypes.FLOAT,
            offsets: DataTypes.ARRAY(DataTypes.STRING),
            shape: DataTypes.STRING,
            position_x: DataTypes.FLOAT,
            position_y: DataTypes.FLOAT,
            created_at: DataTypes.BIGINT,
            updated_at: DataTypes.BIGINT,
        },
        {
            sequelize,
            modelName: "interfaces",
            timestamps: false,
        }
    );
    return interfaces;
};
