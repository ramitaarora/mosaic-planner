const sequelize = require('../config/connection');
const { Tasks } = require('../models');

const dropTasks = async () => {
    const drop = await Tasks.drop();

    process.exit(0);
};

dropTasks();
