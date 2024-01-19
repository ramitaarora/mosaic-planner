const router = require('express').Router();
const { Op } = require('sequelize');
const { User, Goals, Notes, DailyChecks, Events } = require('../../models');

router.get('/allData', async (req, res) => {
    try {
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;
        const day = new Date().getDate();
    
        const userData = await User.findAll({ where: { id: req.session.user_id } });
        const user = userData.map(user => user.get({ plain: true }));
    
        const goalsData = await Goals.findAll({ where: { user_id: req.session.user_id } });
        const notesData = await Notes.findAll({ where: { user_id: req.session.user_id } });
        const dailyChecksData = await DailyChecks.findAll({ where: { user_id: req.session.user_id } });
        const eventsData = await Events.findAll({ where: { 
            user_id: req.session.user_id,
            // date: `${year}-${month}-${day}`
         }})
        const goals = goalsData.map(goal => goal.get({ plain: true }));
        const notes = notesData.map(note => note.get({ plain: true }));
        const dailyChecks = dailyChecksData.map(check => check.get({ plain: true }));
        const events = eventsData.map(event => event.get({ plain: true }));
    
        res.status(200).json({goals, notes, dailyChecks, events, user});
    } catch (err) {
        res.status(400).json(err);
        console.log(err);
    }
});

router.post('/event', async (req, res) => {
    try {
        const eventsData = await Events.findAll({
            where: {
                user_id: req.session.user_id,
                date: `${req.body.year}-${req.body.month}-${req.body.day}`
            }
        })

        if (eventsData.length) {
            res.status(200).json(eventsData);
        } else {
            res.status(200).json({ "message": "No events on this date." });
        }
    } catch (err) {
        res.status(400).json(err);
        console.log(err);
    }
})

router.post('/add', async (req, res) => {
    try {
        if (req.body.type === 'Note') {
            const notesData = await Notes.create({
                note: req.body.note,
                user_id: req.session.user_id
            })
            res.status(200).json(notesData);
        }
        if (req.body.goal_type === 'Goals') {
            const yearlyGoalsData = await Goals.create({
                user_id: req.session.user_id,
                goal: req.body.yearlyGoal,
                goal_type: 'Yearly',
            })
            const parentID = yearlyGoalsData.dataValues.id;

            const monthlyGoalsData = await Goals.create({
                user_id: req.session.user_id,
                goal: req.body.monthlyGoal,
                goal_type: 'Monthly',
                parent_goal: parentID,
            })

            const weeklyGoalsData = await Goals.create({
                user_id: req.session.user_id,
                goal: req.body.weeklyGoal,
                goal_type: 'Weekly',
                parent_goal: parentID,
            })

            res.status(200).json({yearlyGoalsData, monthlyGoalsData, weeklyGoalsData});
            console.log({yearlyGoalsData, monthlyGoalsData, weeklyGoalsData})
        }
    } catch(err) {
        res.status(400).json(err);
        console.log(err)
    }
})

router.put('/edit', async (req, res) => {
    try {
        if (req.body.type === 'Goal') {
            const goalData = await Goals.update({ goal: req.body.goal }, { where: { id: req.body.id } });
            res.status(200).json(goalData);
        }
        if (req.body.type === 'Note') {
            const notesData = await Notes.update({ note: req.body.note }, { where: { id: req.body.id } });
            res.status(200).json(notesData);
        }
        if (req.body.type === 'Event') {
            const eventData = await Events.update({ event: req.body.event }, { where: { id: req.body.id } })
            res.status(200).json(eventData);
        }
    } catch(err) {
        res.status(400).json(err);
        console.log(err)
    }
})

router.delete('/delete', async (req, res) => {
    try {
        if (req.body.type === 'Goal') {
            const goalData = await Goals.destroy({ where: { 
                [Op.or]: [ { id: req.body.id }, { parent_goal: req.body.id } ]
            }});
            res.status(200).json(goalData);
        }
        if (req.body.type === 'Note') {
            const noteData = await Notes.destroy({ where: { id: req.body.id }});
            res.status(200).json(noteData);
        }
        if (req.body.type === 'Event') {
            const eventData = await Events.destroy({ where: { id: req.body.id }});
            res.status(200).json(eventData);
        }
    } catch(err) {
        res.status(400).json(err);
        console.log(err)
    }
})

module.exports = router;
