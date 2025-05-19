const sequelize = require('../config/connection');

const userData = require('./userData.json');
const notesData = require('./notesData.json');
const dailyChecksData = require('./dailyChecksData.json');
const eventsData = require('./eventsData.json');
const taskData = require('./tasksData.json');
const archivedTasksData = require('./archivedTasksData.json');
// const goalsData = require('./goalsData.json');
const stepsData = require('./stepsData.json');
const newTasksData = require('./newTasksData.json');

const { User, DailyChecks, Events, Notes, DailyChecksHistory, Tasks } = require('../models');

const year = new Date().getFullYear();
const month = new Date().getMonth() + 1;
const day = new Date().getDate();
const todaysDate = `${year}-${month}-${day}`;

const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    const user = await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
    });

    const events = await Events.bulkCreate(eventsData, {
        individualHooks: true,
        returning: true,
    })

    const dailyChecks = await DailyChecks.bulkCreate(dailyChecksData, {
        individualHooks: true,
        returning: true,
    })

    for (let i = 0; i < dailyChecksData.length; i++) {
        const dailyChecksHistory = await DailyChecksHistory.create({
            daily_check: dailyChecksData[i].daily_check,
            user_id: dailyChecksData[i].user_id,
            parent_id: dailyChecksData[i].id,
            date: todaysDate,
            completed: false,
        }, {
            individualHooks: true,
            returning: true,
        })
    }

    const notes = await Notes.bulkCreate(notesData, {
        individualHooks: true,
        returning: true,
    })

    // const goals = await Goals.bulkCreate(goalsData, {
    //     individualHooks: true,
    //     returning: true,
    // })

    // const steps = await Goals.bulkCreate(stepsData, {
    //     individualHooks: true,
    //     returning: true,
    // })

    // const goalTasks = await Tasks.bulkCreate(newTasksData, {
    //     individualHooks: true,
    //     returning: true,
    // })

    const tasks = await Tasks.bulkCreate(taskData, {
        individualHooks: true,
        returning: true,
    })

    for (let j = 0; j < archivedTasksData.length; j++) {
        const archivedTasks = await Tasks.create({
            user_id: archivedTasksData[j].user_id,
            task: archivedTasksData[j].task,
            in_progress: archivedTasksData[j].in_progress,
            completed: archivedTasksData[j].completed,
            date_created: new Date(todaysDate),
            date_completed: archivedTasksData[j].date_completed,
            // date_completed: `${year}-${month}-${day + j}`,
            archived: archivedTasksData[j].archived,
        }, {
            individualHooks: true,
            returning: true,
        })
    }

    process.exit(0);
};

seedDatabase();
