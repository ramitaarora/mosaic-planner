const User = require('./User');
const Notes = require('./Notes');
const YearlyGoals = require('./YearlyGoals');
const MonthlyGoals = require('./MonthlyGoals');
const WeeklyGoals = require('./WeeklyGoals');
const DailyChecks = require('./DailyChecks');
const Events = require('./Events');

Notes.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

YearlyGoals.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
})

MonthlyGoals.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
})

WeeklyGoals.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
})

DailyChecks.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
})

Events.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
})

module.exports = { User, Notes, DailyChecks, YearlyGoals, MonthlyGoals, WeeklyGoals, Events };
