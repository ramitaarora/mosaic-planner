const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection')

class Events extends Model {}

Events.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        event: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
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