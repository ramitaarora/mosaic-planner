const sequelize = require('../config/connection');

const userData = require('./userData.json');
const notesData = require('./notesData.json');
const dailyChecksData = require('./dailyChecksData.json');
const yearlyGoalsData = require('./yearlyGoalsData.json');
const monthlyGoalsData = require('./monthlyGoalsData.json');
const weeklyGoalsData = require('./weeklyGoalsData.json');

const { User, Notes, DailyChecks, WeeklyGoals, MonthlyGoals, YearlyGoals } = require('../models');


const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    const users = await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
      });

    const notes = await Notes.bulkCreate(notesData, {
        individualHooks: true,
        returning: true,
    })

    const dailyChecks = await DailyChecks.bulkCreate(dailyChecksData, {
        individualHooks: true,
        returning: true,
    })

    const yearlyGoals = await YearlyGoals.bulkCreate(yearlyGoalsData, {
        individualHooks: true,
        returning: true,
    })

    const monthlyGoals = await MonthlyGoals.bulkCreate(monthlyGoalsData, {
        individualHooks: true,
        returning: true,
    })

    const weeklyGoals = await WeeklyGoals.bulkCreate(weeklyGoalsData, {
        individualHooks: true,
        returning: true,
    })

    

    process.exit(0);
};

seedDatabase();
