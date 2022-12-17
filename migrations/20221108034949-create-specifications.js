"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("specifications", {
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
            balcony: {
                type: Sequelize.STRING,
            },
            front_porch: {
                type: Sequelize.STRING,
            },
            relationship_with_seller: {
                type: Sequelize.STRING,
            },
            facing_building: {
                type: Sequelize.STRING,
            },
            front_road_width: {
                type: Sequelize.STRING,
            },
            facilities_id: {
                type: Sequelize.STRING,
            },
            created_at: {
                type: Sequelize.BIGINT,
            },
            updated_at: {
                type: Sequelize.BIGINT,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("specifications");
    },
};
