const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection')

class Goals extends Model {}

Goals.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
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
            type: DataTypes.INTEGER,
            references: {
                model: 'goals',
                key: 'id'
            },
            onDelete: 'CASCADE',
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
        modelName: 'goals'
    }
);

module.exports = Goals;