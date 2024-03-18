const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/connection')

class DailyChecksHistory extends Model {}

DailyChecksHistory.init(
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
        date: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        completed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        parent_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'dailyChecks',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'dailyChecksHistory'
    }
);

module.exports = DailyChecksHistory;