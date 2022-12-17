"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class kavlings extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    kavlings.init(
        {
            uid: {
                type: DataTypes.STRING,
                unique: true
            },
            property_id: DataTypes.STRING,
            block: DataTypes.STRING,
            certificate: DataTypes.TEXT,
            certificates: DataTypes.ARRAY(DataTypes.TEXT),
            is_sold: DataTypes.BOOLEAN,
            cluster: DataTypes.STRING,
            images: DataTypes.ARRAY(DataTypes.TEXT),
            interface_id: DataTypes.STRING,
            type_house_id: DataTypes.STRING,
            created_at: DataTypes.BIGINT,
            updated_at: DataTypes.BIGINT,
        },
        {
            sequelize,
            modelName: "kavlings",
            timestamps: false,
        }
    );
    return kavlings;
};
