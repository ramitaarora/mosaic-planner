const router = require('express').Router();
const { YearlyGoals, MonthlyGoals, WeeklyGoals, Notes, DailyChecks } = require('../../models');

router.get('/allgoals', async (req, res) => {
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

router.post('/edityearly', async (req, res) => {
    try {
        const yearlyData = await YearlyGoals.update({ yearly_goal: req.body.yearlyGoal }, { where: { id: req.body.id }});
        res.status(200).json(yearlyData);
    } catch (err) {
        res.status(400).json(err);
    }
    
})

module.exports = router;
