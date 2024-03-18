const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/connection')

class Goals extends Model {}

Goals.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        goal: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        goal_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date_created: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
          },
        parent_goal: {
            type: DataTypes.UUID,
            references: {
                model: 'goals',
                key: 'id'
            },
            onDelete: 'CASCADE',
        },
        completed: {
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
        modelName: 'goals'
    }
);

module.exports = Goals;