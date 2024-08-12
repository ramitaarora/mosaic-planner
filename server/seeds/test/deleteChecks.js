const sequelize = require('../../config/connection');
const { DailyChecks, DailyChecksHistory } = require('../../models');

const deleteChecks = async () => {
    await sequelize.sync({ alter: true });
    try {
        const deleteHistory = await DailyChecksHistory.destroy({ where: { user_id: 1 }});
        const deleteChecks = await DailyChecks.destroy({ where: { user_id: 1 }});
    
        console.log('Checks deleted!')
    } catch(err) {
        console.error(err);
    }

    process.exit(0);
};

deleteChecks();