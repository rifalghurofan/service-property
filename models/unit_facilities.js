"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class unit_facilities extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    unit_facilities.init(
        {
            uid: DataTypes.STRING,
            property_id: DataTypes.INTEGER,
            garden: DataTypes.BOOLEAN,
            family_room: DataTypes.STRING,
            living_room: DataTypes.STRING,
            dining_room: DataTypes.STRING,
            kitchen: DataTypes.BOOLEAN,
            bathroom: DataTypes.STRING,
            carport: DataTypes.STRING,
            bedroom: DataTypes.STRING,
            land_area: DataTypes.STRING,
            electricity: DataTypes.STRING,
            certificate: DataTypes.STRING,
            building_area: DataTypes.STRING,
            soil_dimension: DataTypes.STRING,
            water_sources: DataTypes.STRING,
            maid_room: DataTypes.STRING,
            number_of_floor: DataTypes.STRING,
            roof_type: DataTypes.STRING,
            floor_type: DataTypes.STRING,
            garage: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "unit_facilities",
        }
    );
    return unit_facilities;
};
