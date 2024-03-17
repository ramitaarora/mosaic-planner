const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection')

class Tasks extends Model {}

Tasks.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        task: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        in_progress: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        completed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        date_created: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        archived: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
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
        modelName: 'tasks'
    }
);

module.exports = Tasks;