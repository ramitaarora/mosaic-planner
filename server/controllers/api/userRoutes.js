const router = require('express').Router();
const { User, DailyChecks, Events, Notes, DailyChecksHistory, Tasks } = require('../../models');
const withAuth = require('../../utils/auth');
const bcrypt = require('bcrypt');

// const parentGoalsData = require('../../seeds/parentGoalsData.json');
// const childGoalsData = require('../../seeds/childGoalsData.json');
const dailyChecksData = require('../../seeds/dailyChecksData.json');
const eventsData = require('../../seeds/eventsData.json');
const taskData = require('../../seeds/tasksData.json');
const archivedTasksData = require('../../seeds/archivedTasksData.json');

router.get('/getUser', withAuth, async (req, res) => {
  try {
    const userData = await User.findAll({ where: { id: req.session.user_id } });
    const user = userData.map(user => user.get({ plain: true }));

    res.status(200).json({ user });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/updateUser', withAuth, async (req, res) => {
  try {
    if (req.body.type === 'name') {
      const userData = await User.update({ name: req.body.data }, { where: { id: req.session.user_id } });
      res.status(200).json(userData);
    }
    if (req.body.type === 'email') {
      const userData = await User.update({ email: req.body.data }, { where: { id: req.session.user_id } });
      res.status(200).json(userData);
    }
    if (req.body.type === 'location') {
      const userData = await User.update({ location: req.body.data }, { where: { id: req.session.user_id } });
      res.status(200).json(userData);
    }
    if (req.body.type === 'colour') {
      const userData = await User.update({ colour: req.body.colourTheme }, { where: { id: req.session.user_id } });
      res.status(200).json(userData);
    }
    if (req.body.type === 'password') {
      const hash = await bcrypt.hash(req.body.data, 10);
      const userData = await User.update({ password: hash }, { where: { id: req.session.user_id } })
      res.status(200).json(userData);
    }
    if (req.body.type === 'timezone') {
      const userData = await User.update({ timezone: req.body.data }, { where: { id: req.session.user_id } })
      res.status(200).json(userData);
    }
    if (req.body.type === 'temperature') {
      const userData = await User.update({ temperature: req.body.data }, { where: { id: req.session.user_id } })
      res.status(200).json(userData);
    }
  } catch (err) {
    res.status(400).json(err);
  }
})

router.post('/createUser', async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    console.log(err)
    res.status(400).json(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res.status(400).json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json({ user: userData, loggedIn: true });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/login-demo', async (req, res) => {
  try {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();
    const todaysDate = `${year}-${month}-${day}`;

    const deleteEvents = await Events.destroy({ where: { user_id: 1 } });
    const deleteHistory = await DailyChecksHistory.destroy({ where: { user_id: 1 } });
    const deleteChecks = await DailyChecks.destroy({ where: { user_id: 1 } });
    const deleteNotes = await Notes.destroy({ where: { user_id: 1 } });
    // const deleteGoals = await Goals.destroy({ where: { user_id: 1 } });
    const deleteTasks = await Tasks.destroy({ where: { user_id: 1 } });

    try {
      const user = await User.update({
        location: '91101',
        colour: 'blue',
        timezone: 'America/Los_Angeles',
        temperature: 'F'
    }, { where: { id: '1' }});
    } catch(err) {
      console.error(err);
    }

    const events = await Events.bulkCreate(eventsData, {
      individualHooks: true,
      returning: true,
    })

    const dailyChecks = await DailyChecks.bulkCreate(dailyChecksData, {
      individualHooks: true,
      returning: true,
    })

    // const parentGoals = await Goals.bulkCreate(parentGoalsData, {
    //   individualHooks: true,
    //   returning: true,
    // })

    // const childGoals = await Goals.bulkCreate(childGoalsData, {
    //   individualHooks: true,
    //   returning: true,
    // })

    for (let i = 0; i < dailyChecksData.length; i++) {
      const dailyChecksHistory = await DailyChecksHistory.create({
        daily_check: dailyChecksData[i].daily_check,
        user_id: dailyChecksData[i].user_id,
        parent_id: dailyChecksData[i].id,
        date: todaysDate,
        completed: false,
      }, {
        individualHooks: true,
        returning: true,
      })
    }

    const tasks = await Tasks.bulkCreate(taskData, {
      individualHooks: true,
      returning: true,
    })

    for (let j = 0; j < archivedTasksData.length; j++) {
      const archivedTasks = await Tasks.create({
        user_id: archivedTasksData[j].user_id,
        task: archivedTasksData[j].task,
        in_progress: archivedTasksData[j].in_progress,
        completed: archivedTasksData[j].completed,
        date_created: new Date(todaysDate),
        date_completed: archivedTasksData[j].date_completed,
        archived: archivedTasksData[j].archived,
      }, {
        individualHooks: true,
        returning: true,
      })
    }

    const userData = await User.findOne({ where: { email: 'demo@example.com' } });

    if (!userData) {
      res.status(400).json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword('password12345');

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json({ user: userData, loggedIn: true });
    });

  } catch (err) {
    res.status(400).json(err);
  }
})

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).json({ message: 'Logged out!' });
  }
});

module.exports = router;
