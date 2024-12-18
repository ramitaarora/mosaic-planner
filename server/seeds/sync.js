const sequelize = require('../config/connection');

const sync = async () => {
    try {
        await sequelize.sync({ alter: true })

    } catch (error) {
        console.log(error);
    }

    process.exit(0);
}

sync();