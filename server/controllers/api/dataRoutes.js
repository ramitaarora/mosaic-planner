const router = require('express').Router();
const { YearlyGoals, MonthlyGoals, WeeklyGoals, Notes, DailyChecks } = require('../../models');

router.get('/allGoals', async (req, res) => {
    const yearlyGoalsData = await YearlyGoals.findAll();
    const monthlyGoalsData = await MonthlyGoals.findAll();
    const weeklyGoalsData = await WeeklyGoals.findAll();
    const notesData = await Notes.findAll();
    const dailyChecksData = await DailyChecks.findAll();

    const yearlyGoals = yearlyGoalsData.map(goal => goal.get({ plain: true }));
    const monthlyGoals = monthlyGoalsData.map(goal => goal.get({ plain: true }));
    const weeklyGoals = weeklyGoalsData.map(goal => goal.get({ plain: true }));
    const notes = notesData.map(note => note.get({ plain: true }));
    const dailyChecks = dailyChecksData.map(check => check.get({ plain: true }));

    res.json({yearlyGoals, monthlyGoals, weeklyGoals, notes, dailyChecks});
});

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
