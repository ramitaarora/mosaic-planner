const router = require('express').Router();
const { User, Goals, Notes, DailyChecks, Events } = require('../../models');

router.get('/allData', async (req, res) => {
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

    res.json({goals, notes, dailyChecks, events, user});
});

router.post('/add', async (req, res) => {
    try {
        if (req.body.type === 'Note') {
            const notesData = await Notes.create({
                note: req.body.note,
                user_id: req.body.userID
            })
            res.status(200).json(notesData);
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
            const goalData = await Goals.destroy({ where: { id: req.body.id }});
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
