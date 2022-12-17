"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class properties extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    properties.init(
        {
            uid: DataTypes.STRING,
            address: DataTypes.STRING,
            city: DataTypes.STRING,
            lower_city: DataTypes.STRING,
            locality: DataTypes.STRING,
            sublocality: DataTypes.STRING,
            administrative_area: DataTypes.STRING,
            postal_code: DataTypes.STRING,
            brochure: DataTypes.TEXT,
            categories: DataTypes.ARRAY(DataTypes.STRING),
            linked_tender: DataTypes.BOOLEAN,
            creator: DataTypes.STRING,
            description: DataTypes.TEXT,
            developer: DataTypes.STRING,
            developer_id: DataTypes.STRING,
            fee: DataTypes.FLOAT,
            image_map: DataTypes.TEXT,
            images: DataTypes.ARRAY(DataTypes.TEXT),
            index_priority: DataTypes.INTEGER,
            is_secondary: DataTypes.BOOLEAN,
            is_sold: DataTypes.BOOLEAN,
            is_premium: DataTypes.BOOLEAN,
            keywords: DataTypes.ARRAY(DataTypes.STRING),
            listing_id: DataTypes.STRING,
            maps: DataTypes.STRING,
            name: DataTypes.STRING,
            panoramas: DataTypes.ARRAY(DataTypes.TEXT),
            payments: DataTypes.ARRAY(DataTypes.STRING),
            property_type: DataTypes.ENUM("primer", "seken"),
            redirect_tender: DataTypes.BOOLEAN,
            rental_price: DataTypes.BIGINT,
            selling_price: DataTypes.BIGINT,
            sketch: DataTypes.STRING,
            status: DataTypes.ENUM("draft", "published", "archived", "deleted"),
            transaction: DataTypes.ENUM("jual", "sewa"),
            spesification: DataTypes.STRING,
            type_house: DataTypes.ARRAY(DataTypes.STRING),
            created_at: DataTypes.BIGINT,
            updated_at: DataTypes.BIGINT,
        },
        {
            sequelize,
            modelName: "properties",
            timestamps: false,
        }
    );
    return properties;
};
