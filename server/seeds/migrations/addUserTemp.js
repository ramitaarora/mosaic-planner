const { DataTypes } = require('sequelize');
const sequelize = require('../../config/connection');
const queryInterface = sequelize.getQueryInterface();
const { User } = require('../../models');

const addUserTemp = async () => {
    try {
        await sequelize.sync({ alter: true })

        await queryInterface.addColumn('user', 'temperature', {
            type:
                DataTypes.STRING,
                defaultValue: 'F',
        });
        
        const userData = await User.findAll();
        const users = userData.map(user => user.get({ plain: true }));

        console.log(users);
        console.table(users);

    } catch (error) {
        console.log(error);
    }

    process.exit(0);
}

addUserTemp();