"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class near_facilities extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    near_facilities.init(
        {
            uid: DataTypes.STRING,
            property_id: DataTypes.STRING,
            name: DataTypes.STRING,
            mileage: DataTypes.INTEGER,
            created_at: DataTypes.BIGINT,
            updated_at: DataTypes.BIGINT,
        },
        {
            sequelize,
            modelName: "near_facilities",
            timestamps: false,
        }
    );
    return near_facilities;
};
