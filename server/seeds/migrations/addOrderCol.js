const { DataTypes } = require('sequelize');
const sequelize = require('../../config/connection');
const queryInterface = sequelize.getQueryInterface();
const { Notes } = require('../../models');

const addOrderCol = async () => {
    try {
        await sequelize.sync({ alter: true })

        // await queryInterface.addColumn('notes', 'order', {
        //     type:
        //         DataTypes.INTEGER,
        // });
        
        // const notesData = await Notes.findAll();
        // const notes = notesData.map(note => note.get({ plain: true }));

        // console.log(notes);
        // console.table(notes);

    } catch (error) {
        console.log(error);
    }

    process.exit(0);
}

addOrderCol();