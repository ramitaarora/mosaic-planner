const router = require('express').Router();
const { Op } = require('sequelize');
const withAuth = require('../../utils/auth');
const { User, Goals, Notes, DailyChecks, DailyChecksHistory, Events, Tasks } = require('../../models');

const year = new Date().getFullYear();
const month = new Date().getMonth() + 1;
const day = new Date().getDate();

router.get('/allData', withAuth, async (req, res) => {
    try {
        const userData = await User.findAll({ where: { id: req.session.user_id } });
        const goalsData = await Goals.findAll({ where: { user_id: req.session.user_id } });
        const notesData = await Notes.findAll({ where: { user_id: req.session.user_id } });
        const eventsData = await Events.findAll({ where: { user_id: req.session.user_id } });
        const tasksData = await Tasks.findAll({ where: { user_id: req.session.user_id } });

        const user = userData.map(user => user.get({ plain: true }));
        const goals = goalsData.map(goal => goal.get({ plain: true }));
        const notes = notesData.map(note => note.get({ plain: true }));
        const events = eventsData.map(event => event.get({ plain: true }));
        const tasks = tasksData.map(task => task.get({ plain: true }));

        let dailyChecksData = await DailyChecksHistory.findAll({
            where: {
                user_id: req.session.user_id,
                date: `${year}-${month}-${day}`
            }
        });

        if (!dailyChecksData.length) {
            const existingDailyChecks = await DailyChecks.findAll({ where: { user_id: req.session.user_id } })

            if (existingDailyChecks) {

                for (let i = 0; i < existingDailyChecks.length; i++) {
                    const checksData = await DailyChecksHistory.create({
                        daily_check: existingDailyChecks[i].daily_check,
                        user_id: req.session.user_id,
                        date: `${year}-${month}-${day}`,
                        completed: false,
                        parent_id: existingDailyChecks[i].id
                    })
                }

                dailyChecksData = await DailyChecksHistory.findAll({
                    where: {
                        user_id: req.session.user_id,
                        date: `${year}-${month}-${day}`
                    }
                });

            }
        }
        const dailyChecks = dailyChecksData.map(check => check.get({ plain: true }));

        res.status(200).json({ goals, notes, dailyChecks, events, user, tasks });
    } catch (err) {
        res.status(400).json(err);
        console.log(err);
    }
});

router.get('/checks', withAuth, async (req, res) => {
    try {
        const checksData = await DailyChecks.findAll({
            where: { user_id: req.session.user_id }
        })
        if (checksData.length) {
            res.status(200).json(checksData);
        } else {
            res.status(200).json({ "Message": "No existing checks." });
        }
    } catch (err) {
        res.status(400).json(err);
        console.log(err);
    }
})

router.get('/checksHistory', withAuth, async (req, res) => {
    try {
        const checksData = await DailyChecksHistory.findAll({
            where: {
                user_id: req.session.user_id,
                date: `${year}-${month}-${day}`
            }
        })
        if (checksData.length) {
            res.status(200).json(checksData);
        } else {
            res.status(200).json({ "Message": "No existing checks for today." })
        }
    } catch (err) {
        res.status(400).json(err);
        console.log(err);
    }
})

router.put('/completed', withAuth, async (req, res) => {
    try {
        if (req.body.type === 'Daily Check') {
            const checksData = await DailyChecksHistory.update({ completed: req.body.completed }, {
                where: {
                    id: req.body.id,
                    user_id: req.session.user_id,
                }
            })
            res.status(200).json(checksData);
        }
        if (req.body.type === 'Task') {
            const taskData = await Tasks.update({ completed: req.body.completed }, {
                where: {
                    id: req.body.id,
                    user_id: req.session.user_id,
                }
            })
            res.status(200).json(taskData);
        }
        if (req.body.type === 'Goal') {
            const parentGoalData = await Goals.findAll({
                where: {
                    user_id: req.session.user_id,
                    id: req.body.id,
                    parent_goal: {
                        [Op.not]: null
                    }
                }
            })

            if (!parentGoalData.length) {
                try {
                    const parentData = await Goals.update({ completed: req.body.completed }, {
                        where: {
                            id: req.body.id,
                            user_id: req.session.user_id,
                        }
                    })

                    const childData = await Goals.update({ completed: req.body.completed }, {
                        where: {
                            parent_goal: req.body.id,
                            user_id: req.session.user_id,
                        }
                    })

                    res.status(200).json({parentData, childData});
                } catch (err) {
                    res.status(400).json(err);
                    console.log(err);
                }

            } else {
                try {
                    const goalsData = await Goals.update({ completed: req.body.completed }, {
                        where: {
                            id: req.body.id,
                            user_id: req.session.user_id,
                        }
                    })
                    res.status(200).json(goalsData);
                } catch (err) {
                    res.status(400).json(err);
                    console.log(err);
                }
            }
        }
    } catch (err) {
        res.status(400).json(err);
        console.log(err);
    }
})

router.put('/inProgress', withAuth, async (req, res) => {
    try {
        const taskData = await Tasks.update({ in_progress: req.body.inProgress }, {
            where: {
                id: req.body.id,
                user_id: req.session.user_id,
            }
        })
        res.status(200).json(taskData);
    } catch (err) {
        res.status(400).json(err);
        console.log(err);
    }
})

router.put('/archiveTask', withAuth, async (req,res) => {
    try {
        const taskData = await Tasks.update({ 
            archived: true,
            in_progress: false, 
        }, { where: {
                id: req.body.id,
                user_id: req.session.user_id
            }
        });

        res.status(200).json(taskData);
    } catch (err) {
        res.status(400).json(err);
        console.log(err);
    }
})

router.post('/add', withAuth, async (req, res) => {
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

            res.status(200).json({ yearlyGoalsData, monthlyGoalsData, weeklyGoalsData });
            console.log({ yearlyGoalsData, monthlyGoalsData, weeklyGoalsData })
        }
        if (req.body.type === 'Daily Check') {
            const checksData = await DailyChecks.create({
                daily_check: req.body.dailyCheck,
                user_id: req.session.user_id
            })
            res.status(200).json(checksData);
        }
        if (req.body.type === 'Daily Checks History') {
            const checksData = await DailyChecksHistory.create({
                daily_check: req.body.dailyCheck,
                user_id: req.session.user_id,
                date: `${year}-${month}-${day}`,
                completed: false,
                parent_id: req.body.parentID
            })
            res.status(200).json(checksData);
        }

        if (req.body.type === 'Event') {
            const eventData = await Events.create({
                event: req.body.event,
                date: req.body.date,
                start_date: req.body.startDate,
                end_date: req.body.endDate,
                start_time: req.body.startTime,
                end_time: req.body.endTime,
                all_day: req.body.allDay,
                address: req.body.address,
                recurring: req.body.recurring,
                user_id: req.session.user_id,
            })
            res.status(200).json(eventData);
        }
        if (req.body.type === 'Task') {
            const taskData = await Tasks.create({
                task: req.body.task,
                user_id: req.session.user_id
            })
            res.status(200).json(taskData);
        }
    } catch (err) {
        res.status(400).json(err);
        console.log(err)
    }
})

router.put('/edit', withAuth, async (req, res) => {
    try {
        if (req.body.type === 'Goal') {
            const goalData = await Goals.update({ goal: req.body.goal }, {
                where: {
                    id: req.body.id,
                    user_id: req.session.user_id,
                }
            });
            res.status(200).json(goalData);
        }
        if (req.body.type === 'Note') {
            const notesData = await Notes.update({ note: req.body.note }, {
                where: {
                    id: req.body.id,
                    user_id: req.session.user_id,
                }
            });
            res.status(200).json(notesData);
        }
        if (req.body.type === 'Event') {
            const eventData = await Events.update({
                event: req.body.event,
                date: req.body.date,
                start_time: req.body.startTime,
                end_time: req.body.endTime,
                all_day: req.body.allDay,
                address: req.body.address,
                start_date: req.body.startDate,
                recurring: req.body.recurring,
            },
                {
                    where: {
                        id: req.body.id,
                        user_id: req.session.user_id,
                    }
                })
            res.status(200).json(eventData);
        }
        if (req.body.type === 'Daily Check') {
            const checksData = await DailyChecks.update({ daily_check: req.body.check }, {
                where: {
                    id: req.body.id,
                    user_id: req.session.user_id,
                }
            })
            res.status(200).json(checksData);
        }
        if (req.body.type === 'Daily Check History') {
            const checksData = await DailyChecksHistory.update({ daily_check: req.body.check }, {
                where: {
                    id: req.body.id,
                    user_id: req.session.user_id,
                }
            })
            res.status(200).json(checksData);
        }
        if (req.body.type === 'Task') {
            const taskData = await Tasks.update({ task: req.body.task }, {
                where: {
                    id: req.body.id,
                    user_id: req.session.user_id,
                }
            })
            res.status(200).json(taskData);
        }
    } catch (err) {
        res.status(400).json(err);
        console.log(err)
    }
})

router.delete('/delete', withAuth, async (req, res) => {
    try {
        if (req.body.type === 'Goal') {
            const goalType = await Goals.findOne({
                where: {
                    user_id: req.session.user_id,
                    id: req.body.id
                }
            });

            if (goalType.dataValues.goal_type === 'Weekly' || goalType.dataValues.goal_type === 'Monthly') {
                const goalsData = await Goals.destroy({
                    where: {
                        user_id: req.session.user_id,
                        id: goalType.dataValues.parent_goal,
                    },
                });
                res.status(200).json(goalsData);
            } else {
                const goalsData = await Goals.destroy({
                    where: {
                        user_id: req.session.user_id,
                        id: req.body.id
                    },
                });
                res.status(200).json(goalsData);
            }

        }
        if (req.body.type === 'Note') {
            const noteData = await Notes.destroy({
                where: {
                    id: req.body.id,
                    user_id: req.session.user_id,
                }
            });
            res.status(200).json(noteData);
        }
        if (req.body.type === 'Event') {
            const eventData = await Events.destroy({
                where: {
                    id: req.body.id,
                    user_id: req.session.user_id,
                }
            });
            res.status(200).json(eventData);
        }
        if (req.body.type === 'Daily Check') {
            const checksData = await DailyChecks.destroy({
                where: {
                    id: req.body.id,
                    user_id: req.session.user_id,
                }
            });
            res.status(200).json(checksData);
        }
        if (req.body.type === 'Daily Check History') {
            const checksData = await DailyChecksHistory.destroy({
                where: {
                    id: req.body.id,
                    user_id: req.session.user_id,
                }
            });
            res.status(200).json(checksData);
        }
        if (req.body.type === 'Task') {
            const taskData = await Tasks.destroy({
                where: {
                    id: req.body.id,
                    user_id: req.session.user_id,
                }
            });
            res.status(200).json(taskData);
        }
    } catch (err) {
        res.status(400).json(err);
        console.log(err)
    }
})

module.exports = router;
