const User = require('./User');
const Projects = require('./Projects');
const Goals = require('./Goals');
const Notes = require('./Notes');
const DailyChecks = require('./DailyChecks');
const DailyChecksHistory = require('./DailyChecksHistory');
const Events = require('./Events');
const Tasks = require('./Tasks');

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

DailyChecksHistory.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
})

Events.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
})

Tasks.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
})

Projects.hasMany(Tasks, {
    foreignKey: 'project_id',
    onDelete: 'SET NULL'
})

module.exports = { User, Projects, DailyChecks, DailyChecksHistory, Events, Notes, Tasks };
