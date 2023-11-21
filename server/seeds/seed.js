const sequelize = require('../config/connection');

const userData = require('./userData.json');
const postData = require('./postData.json');
const commentData = require('./commentData.json');

const { User, Posts, Comments } = require('../models');


const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    // const users = await User.bulkCreate(userData, {
    //     individualHooks: true,
    //     returning: true,
    //   });

    //   const posts = await Posts.bulkCreate(postData, {
    //     individualHooks: true,
    //     returning: true,
    //   });

    //   const comments = await Comments.bulkCreate(commentData, {
    //     individualHooks: true,
    //     returning: true,
    //   });

    process.exit(0);
};

seedDatabase();
