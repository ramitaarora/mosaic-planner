const sequelize = require('../config/connection');
const { Tasks } = require('../models');
const taskData = require('./tasksData.json');

const seedDatabase = async () => {
    // await Tasks.sync({ force: true });

    const newTasks = await Tasks.bulkCreate(taskData, {
        individualHooks: true,
        returning: true,
    })

    process.exit(0);
};

seedDatabase();
