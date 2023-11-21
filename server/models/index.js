const User = require('./User');
const Posts = require('./Posts');
const Comments = require('./Comments');

Posts.belongsTo(User, {
    foreignKey: 'author_id',
    onDelete: 'CASCADE'
});

// User.hasMany(Posts, {
//     foreignKey: 'author_id',
//     onDelete: 'CASCADE'
// })

Comments.belongsTo(User, {
    foreignKey: 'author_id',
    onDelete: 'CASCADE'
})

// User.hasMany(Comments, {
//     foreignKey: 'author_id',
//     onDelete: 'CASCADE'
// })

// Comments.belongsTo(Posts, {
//     foreignKey: 'post_id',
//     onDelete: 'CASCADE'
// })

Posts.hasMany(Comments, {
    foreignKey: 'post_id',
    onDelete: 'CASCADE'
})

module.exports = { User, Posts, Comments };
