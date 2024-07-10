const { DataTypes } = require('sequelize');
const sequelize = require('../../config/connection');
const queryInterface = sequelize.getQueryInterface();
const { User } = require('../../models');

const addTimezone = async () => {
    try {
        await sequelize.sync({ alter: true })

        await queryInterface.addColumn('User', 'timezone', {
            type:
                DataTypes.STRING,
            defaultValue: 'America/Los_Angeles',
        });
        
        const userData = await User.findAll();
        const users = userData.map(user => user.get({ plain: true }));

        console.log(users);

    } catch (error) {
        console.log(error);
    }

    process.exit(0);
}

addTimezone();