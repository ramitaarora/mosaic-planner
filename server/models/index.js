const User = require('./User');
const Goals = require('./Goals');
const Notes = require('./Notes');
const DailyChecks = require('./DailyChecks');
const Events = require('./Events');

Notes.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Goals.belongsTo(User, {
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

module.exports = { User, Goals, DailyChecks, Events, Notes };
