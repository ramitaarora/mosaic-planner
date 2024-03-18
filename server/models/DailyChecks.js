const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/connection')

class DailyChecks extends Model {}

DailyChecks.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        daily_check: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        archived: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'dailyChecks'
    }
);

module.exports = DailyChecks;