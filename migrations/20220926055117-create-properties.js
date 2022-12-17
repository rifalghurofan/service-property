"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            "properties",
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                uid: {
                    type: Sequelize.STRING,
                },
                address: {
                    type: Sequelize.STRING,
                },
                city: {
                    type: Sequelize.STRING,
                },
                lower_city: {
                    type: Sequelize.STRING,
                },
                locality: {
                    type: Sequelize.STRING,
                },
                sublocality: {
                    type: Sequelize.STRING,
                },
                administrative_area: {
                    type: Sequelize.STRING,
                },
                postal_code: {
                    type: Sequelize.STRING,
                },
                brochure: {
                    type: Sequelize.TEXT,
                },
                categories: {
                    type: Sequelize.ARRAY(Sequelize.STRING),
                },
                linked_tender: {
                    type: Sequelize.BOOLEAN,
                },
                creator: {
                    type: Sequelize.STRING,
                },
                description: {
                    type: Sequelize.TEXT,
                },
                developer: {
                    type: Sequelize.STRING,
                },
                developer_id: {
                    type: Sequelize.STRING,
                },
                fee: {
                    type: Sequelize.FLOAT,
                },
                image_map: {
                    type: Sequelize.TEXT,
                },
                images: {
                    type: Sequelize.ARRAY(Sequelize.TEXT),
                },
                index_priority: {
                    type: Sequelize.INTEGER,
                },
                is_secondary: {
                    type: Sequelize.BOOLEAN,
                },
                is_sold: {
                    type: Sequelize.BOOLEAN,
                },
                is_premium: {
                    type: Sequelize.BOOLEAN,
                },
                keywords: {
                    type: Sequelize.ARRAY(Sequelize.STRING),
                },
                listing_id: {
                    type: Sequelize.STRING,
                },
                maps: {
                    type: Sequelize.STRING,
                },
                name: {
                    type: Sequelize.STRING,
                },
                panoramas: {
                    type: Sequelize.ARRAY(Sequelize.TEXT),
                },
                payments: {
                    type: Sequelize.ARRAY(Sequelize.STRING),
                },
                property_type: {
                    type: Sequelize.ENUM("primer", "seken"),
                },
                redirect_tender: {
                    type: Sequelize.BOOLEAN,
                },
                rental_price: {
                    type: Sequelize.BIGINT,
                },
                selling_price: {
                    type: Sequelize.BIGINT,
                },
                sketch: {
                    type: Sequelize.STRING,
                },
                status: {
                    type: Sequelize.ENUM(
                        "draft",
                        "published",
                        "archived",
                        "deleted"
                    ),
                },
                transaction: {
                    type: Sequelize.ENUM("jual", "sewa"),
                },
                spesification: {
                    type: Sequelize.STRING,
                },
                type_house: {
                    type: Sequelize.ARRAY(Sequelize.STRING),
                },
                created_at: {
                    type: Sequelize.BIGINT,
                },
                updated_at: {
                    type: Sequelize.BIGINT,
                },
            },
            { timestamps: false }
        );
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("properties");
    },
};
