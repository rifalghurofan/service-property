"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            "interfaces",
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
                kavling_id: {
                    type: Sequelize.INTEGER,
                },
                color: {
                    type: Sequelize.STRING,
                },
                height: {
                    type: Sequelize.FLOAT,
                },
                width: {
                    type: Sequelize.FLOAT,
                },
                offsets: {
                    type: Sequelize.ARRAY(Sequelize.STRING),
                },
                shape: {
                    type: Sequelize.STRING,
                },
                position_x: {
                    type: Sequelize.FLOAT,
                },
                position_y: {
                    type: Sequelize.FLOAT,
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
        await queryInterface.dropTable("interfaces");
    },
};
