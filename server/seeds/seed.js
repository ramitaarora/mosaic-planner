const sequelize = require('../config/connection');

const userData = require('./userData.json');
const notesData = require('./notesData.json');
const goalsData = require('./goalsData.json');
const dailyChecksData = require('./dailyChecksData.json');
const eventsData = require('./eventsData.json');

const { User, Goals, DailyChecks, Events, Notes } = require('../models');

const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    const users = await User.bulkCreate(userData, {
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

    const notes = await Notes.bulkCreate(notesData, {
        individualHooks: true,
        returning: true,
    })

    const goals = await Goals.bulkCreate(goalsData, {
        individualHooks: true,
        returning: true,
    })

    process.exit(0);
};

seedDatabase();
