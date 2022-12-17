"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class specifications extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    specifications.init(
        {
            uid: DataTypes.STRING,
            property_id: DataTypes.STRING,
            balcony: DataTypes.STRING,
            front_porch: DataTypes.STRING,
            relationship_with_seller: DataTypes.STRING,
            facing_building: DataTypes.STRING,
            front_road_width: DataTypes.STRING,
            facilities_id: DataTypes.STRING,
            created_at: DataTypes.BIGINT,
            updated_at: DataTypes.BIGINT,
        },
        {
            sequelize,
            modelName: "specifications",
            timestamps: false,
        }
    );
    return specifications;
};
