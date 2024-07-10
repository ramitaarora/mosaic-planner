const sequelize = require('../config/connection');
const { User, DailyChecks, Events, Goals, Notes, Tasks } = require('../models');

const seeData = async () => {
    try {
        const userData = await User.findAll();
        const users = userData.map(user => user.get({ plain: true }));
        console.log(users);

        // const checksData = await DailyChecks.findAll();
        // const checks = checksData.map(check => check.get({ plain: true }));
        // console.log(checks);

        // const eventsData = await Events.findAll();
        // const events = eventsData.map(event => event.get({ plain: true }));
        // console.log(events);

        // const goalsData = await Goals.findAll();
        // const goals = goalsData.map(goal => goal.get({ plain: true }));
        // console.log(goals);

        // const notesData = await Notes.findAll();
        // const notes = notesData.map(note => note.get({ plain: true }));
        // console.log(notes);

        // const tasksData = await Tasks.findAll();
        // const tasks = tasksData.map(task => task.get({ plain: true }));
        // console.log(tasks);

    } catch (error) {
        console.log(error);
    }

    process.exit(0);
}

seeData();