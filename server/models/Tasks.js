const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/connection')

class Tasks extends Model {}

Tasks.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        task: {
            type: DataTypes.STRING,
            allowNull: false,
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
        date_completed: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        archived: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        goal_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'goals',
                key: 'id'
            }
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
        modelName: 'tasks'
    }
);

module.exports = Tasks;