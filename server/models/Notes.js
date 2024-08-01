const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/connection')

class Notes extends Model {}

Notes.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        note: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date_created: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
          },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        archived: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        order: {
            type: DataTypes.INTEGER,
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
        modelName: 'notes'
    }
);

module.exports = Notes;