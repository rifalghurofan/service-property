"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            "type_houses",
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
                property_id: {
                    type: Sequelize.INTEGER,
                },
                booking_fee: {
                    type: Sequelize.BIGINT,
                },
                name: {
                    type: Sequelize.STRING,
                },
                business: {
                    type: Sequelize.STRING,
                },
                color: {
                    type: Sequelize.STRING,
                },
                description: {
                    type: Sequelize.TEXT,
                },
                images: {
                    type: Sequelize.ARRAY(Sequelize.TEXT),
                },
                other_business: {
                    type: Sequelize.STRING,
                },
                price: {
                    type: Sequelize.BIGINT,
                },
                property_type: {
                    type: Sequelize.ENUM("1", "2"),
                },
                slot: {
                    type: Sequelize.INTEGER,
                },
                unit_facilities: {
                    type: Sequelize.ARRAY(Sequelize.STRING),
                },
                live_previews: {
                    type: Sequelize.ARRAY(Sequelize.TEXT),
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
        await queryInterface.dropTable("type_houses");
    },
};
