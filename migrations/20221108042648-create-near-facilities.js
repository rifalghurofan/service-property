"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("near_facilities", {
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
            name: {
                type: Sequelize.STRING,
            },
            mileage: {
                type: Sequelize.INTEGER,
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
        await queryInterface.dropTable("near_facilities");
    },
};
