const router = require('express').Router();
const { User, YearlyGoals, MonthlyGoals, WeeklyGoals, Notes, DailyChecks, Events } = require('../../models');

router.get('/allData', async (req, res) => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();

    const userData = await User.findAll({ where: { id: req.session.user_id } });
    const user = userData.map(user => user.get({ plain: true }));

    const yearlyGoalsData = await YearlyGoals.findAll({ where: { user_id: req.session.user_id } });
    const monthlyGoalsData = await MonthlyGoals.findAll({ where: { user_id: req.session.user_id } });
    const weeklyGoalsData = await WeeklyGoals.findAll({ where: { user_id: req.session.user_id } });
    const notesData = await Notes.findAll({ where: { user_id: req.session.user_id } });
    const dailyChecksData = await DailyChecks.findAll({ where: { user_id: req.session.user_id } });
    const eventsData = await Events.findAll({ where: { 
        user_id: req.session.user_id,
        date: `${year}-${month}-${day}`
     }})

    const yearlyGoals = yearlyGoalsData.map(goal => goal.get({ plain: true }));
    const monthlyGoals = monthlyGoalsData.map(goal => goal.get({ plain: true }));
    const weeklyGoals = weeklyGoalsData.map(goal => goal.get({ plain: true }));
    const notes = notesData.map(note => note.get({ plain: true }));
    const dailyChecks = dailyChecksData.map(check => check.get({ plain: true }));
    const events = eventsData.map(event => event.get({ plain: true }));

    res.json({yearlyGoals, monthlyGoals, weeklyGoals, notes, dailyChecks, events, user});
});

router.post('/addGoal', async (req, res) => {
    try {
        if (req.body.goalType === 'Yearly') {
            const yearlyData = await YearlyGoals.create({
                yearly_goal: req.body.goal,
                user_id: req.body.userID
            })
            res.status(200).json(yearlyData);
        }
        if (req.body.goalType === 'Monthly') {
            const monthlyData = await MonthlyGoals.create({
                monthly_goal: req.body.goal,
                user_id: req.body.userID
            })
            res.status(200).json(monthlyData);
        }
        if (req.body.goalType === 'Weekly') {
            const weeklyData = await WeeklyGoals.create({
                weekly_goal: req.body.goal,
                user_id: req.body.userID
            })
            res.status(200).json(weeklyData);
        }
        if (req.body.goalType === 'Note') {
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

router.put('/editGoal', async (req, res) => {
    try {
        if (req.body.goalType === 'Yearly') {
            const yearlyData = await YearlyGoals.update({ yearly_goal: req.body.goal }, { where: { id: req.body.id }});
            res.status(200).json(yearlyData);
        }
        if (req.body.goalType === 'Monthly') {
            const monthlyData = await MonthlyGoals.update({ monthly_goal: req.body.goal }, { where: { id: req.body.id }});
            res.status(200).json(monthlyData);
        }
        if (req.body.goalType === 'Weekly') {
            const weeklyData = await WeeklyGoals.update({ weekly_goal: req.body.goal }, { where: { id: req.body.id }});
            res.status(200).json(weeklyData);
        }
        if (req.body.goalType === 'Note') {
            const notesData = await Notes.update({ note: req.body.note }, { where: { id: req.body.id }});
            res.status(200).json(notesData);
        }
    } catch(err) {
        res.status(400).json(err);
        console.log(err)
    }
})

router.post('/deleteGoal', async (req, res) => {
    try {
        if (req.body.goalType === 'Yearly') {
            const yearlyData = await YearlyGoals.destroy({ where: { id: req.body.id }});
            res.status(200).json(yearlyData);
        }
        if (req.body.goalType === 'Monthly') {
            const monthlyData = await MonthlyGoals.destroy({ where: { id: req.body.id }});
            res.status(200).json(monthlyData);
        }
        if (req.body.goalType === 'Weekly') {
            const weeklyData = await WeeklyGoals.destroy({ where: { id: req.body.id }});
            res.status(200).json(weeklyData);
        }
        if (req.body.goalType === 'Note') {
            const notesData = await Notes.destroy({ where: { id: req.body.id }});
            res.status(200).json(notesData);
        }
    } catch(err) {
        res.status(400).json(err);
        console.log(err)
    }
})

module.exports = router;
