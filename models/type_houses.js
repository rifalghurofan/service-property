"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class type_houses extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    type_houses.init(
        {
            uid: {
                type: DataTypes.STRING,
                unique: true
            },
            property_id: DataTypes.STRING,
            booking_fee: DataTypes.BIGINT,
            name: DataTypes.STRING,
            business: DataTypes.STRING,
            color: DataTypes.STRING,
            description: DataTypes.TEXT,
            images: DataTypes.ARRAY(DataTypes.TEXT),
            other_business: DataTypes.STRING,
            price: DataTypes.BIGINT,
            property_type: DataTypes.ENUM("Tempat Usaha", "Tempat Tinggal"),
            slot: DataTypes.INTEGER,
            unit_facilities: DataTypes.ARRAY(DataTypes.STRING),
            live_previews: DataTypes.ARRAY(DataTypes.TEXT),
            created_at: DataTypes.BIGINT,
            updated_at: DataTypes.BIGINT,
        },
        {
            sequelize,
            modelName: "type_houses",
            timestamps: false,
        }
    );
    return type_houses;
};
