"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("unit_facilities", {
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
            garden: {
                type: Sequelize.BOOLEAN,
            },
            family_room: {
                type: Sequelize.STRING,
            },
            living_room: {
                type: Sequelize.STRING,
            },
            dining_room: {
                type: Sequelize.STRING,
            },
            kitchen: {
                type: Sequelize.BOOLEAN,
            },
            bathroom: {
                type: Sequelize.STRING,
            },
            carport: {
                type: Sequelize.STRING,
            },
            bedroom: {
                type: Sequelize.STRING,
            },
            land_area: {
                type: Sequelize.STRING,
            },
            electricity: {
                type: Sequelize.STRING,
            },
            certificate: {
                type: Sequelize.STRING,
            },
            building_area: {
                type: Sequelize.STRING,
            },
            soil_dimension: {
                type: Sequelize.STRING,
            },
            water_sources: {
                type: Sequelize.STRING,
            },
            maid_room: {
                type: Sequelize.STRING,
            },
            number_of_floor: {
                type: Sequelize.STRING,
            },
            roof_type: {
                type: Sequelize.STRING,
            },
            floor_type: {
                type: Sequelize.STRING,
            },
            garage: {
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("unit_facilities");
    },
};
