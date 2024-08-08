const { DataTypes } = require('sequelize');
const sequelize = require('../../config/connection');
const queryInterface = sequelize.getQueryInterface();
const { User } = require('../../models');

const addTimezone = async () => {
    try {
        await sequelize.sync({ alter: true })

        await queryInterface.addColumn('user', 'timezone', {
            type:
                DataTypes.STRING,
                defaultValue: 'America/Los_Angeles',
        });

    } catch (error) {
        console.log(error);
    }

    process.exit(0);
}

addTimezone();