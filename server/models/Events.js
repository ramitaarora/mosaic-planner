const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/connection')

class Events extends Model {}

Events.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        event: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: DataTypes.STRING,
        },
        start_date: {
            type: DataTypes.STRING,
        },
        end_date: {
            type: DataTypes.STRING,
        },
        start_time: {
            type: DataTypes.STRING,
        },
        end_time: {
            type: DataTypes.STRING,
        },
        all_day: {
            type: DataTypes.BOOLEAN,
        },
        recurring: {
            type: DataTypes.STRING,
        },
        address: {
            type: DataTypes.STRING,
        },
        archived: {
            type: DataTypes.BOOLEAN,
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
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'events'
    }
);

module.exports = Events;