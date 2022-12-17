"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            "kavlings",
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
                block: {
                    type: Sequelize.STRING,
                },
                certificate: {
                    type: Sequelize.STRING,
                },
                certificates: {
                    type: Sequelize.ARRAY(Sequelize.STRING),
                },
                is_sold: {
                    type: Sequelize.BOOLEAN,
                },
                cluster: {
                    type: Sequelize.STRING,
                },
                images: {
                    type: Sequelize.ARRAY(Sequelize.STRING),
                },
                interface_id: {
                    type: Sequelize.STRING,
                },
                type_house_id: {
                    type: Sequelize.STRING,
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
        await queryInterface.dropTable("kavlings");
    },
};
