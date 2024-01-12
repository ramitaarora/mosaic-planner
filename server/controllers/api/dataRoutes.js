const router = require('express').Router();
const { YearlyGoals, MonthlyGoals, WeeklyGoals, Notes, DailyChecks, Events } = require('../../models');

router.get('/allData', async (req, res) => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();

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

    res.json({yearlyGoals, monthlyGoals, weeklyGoals, notes, dailyChecks, events});
});

router.post('/addGoal', async (req, res) => {
    try {
        if (req.body.goalType === 'Yearly') {
            const yearlyData = await YearlyGoals.create({
                yearly_goal: req.body.goal,
                author_id: req.body.authorID
            })
            res.status(200).json(yearlyData);
        }
        if (req.body.goalType === 'Monthly') {
            const monthlyData = await MonthlyGoals.create({
                monthly_goal: req.body.goal,
                author_id: req.body.authorID
            })
            res.status(200).json(monthlyData);
        }
        if (req.body.goalType === 'Weekly') {
            const weeklyData = await WeeklyGoals.create({
                weekly_goal: req.body.goal,
                author_id: req.body.authorID
            })
            res.status(200).json(weeklyData);
        }
        if (req.body.goalType === 'Note') {
            const notesData = await Notes.create({
                note: req.body.note,
                author_id: req.body.authorID
            })
            res.status(200).json(notesData);
        }
    } catch(err) {
        res.status(400).json(err);
        console.log(err)
    }
})

router.post('/editYearly', async (req, res) => {
    try {
        const yearlyData = await YearlyGoals.update({ yearly_goal: req.body.yearlyGoal }, { where: { id: req.body.id }});
        res.status(200).json(yearlyData);
    } catch (err) {
        res.status(400).json(err);
    }
    
})

router.delete('/deleteYearly', async (req, res) => {
    try {
        const yearlyData = await YearlyGoals.destroy({ where: { id: req.body.id }});
        res.status(200).json(yearlyData);
    } catch(err) {
        res.status(400).json(err);
    }
})

router.post('/editMonthly', async (req, res) => {
    try {
        const monthlyData = await MonthlyGoals.update({ monthly_goal: req.body.monthlyGoal }, { where: { id: req.body.id }});
        res.status(200).json(monthlyData);
    } catch (err) {
        res.status(400).json(err);
    }
    
})

router.delete('/deleteMonthly', async (req, res) => {
    try {
        const monthlyData = await MonthlyGoals.destroy({ where: { id: req.body.id }});
        res.status(200).json(monthlyData);
    } catch(err) {
        res.status(400).json(err);
    }
})

router.post('/editWeekly', async (req, res) => {
    try {
        const weeklyData = await WeeklyGoals.update({ weekly_goal: req.body.weeklyGoal }, { where: { id: req.body.id }});
        res.status(200).json(weeklyData);
    } catch (err) {
        res.status(400).json(err);
    }
    
})

router.delete('/deleteWeekly', async (req, res) => {
    try {
        const weeklyData = await WeeklyGoals.destroy({ where: { id: req.body.id }});
        res.status(200).json(weeklyData);
    } catch(err) {
        res.status(400).json(err);
    }
})

router.post('/editNote', async (req, res) => {
    try {
        const notesData = await Notes.update({ note: req.body.note }, { where: { id: req.body.id }});
        res.status(200).json(notesData);
    } catch (err) {
        res.status(400).json(err);
    }
    
})

router.delete('/deleteNote', async (req, res) => {
    try {
        const notesData = await Notes.destroy({ where: { id: req.body.id }});
        res.status(200).json(notesData);
    } catch(err) {
        res.status(400).json(err);
    }
})

module.exports = router;
