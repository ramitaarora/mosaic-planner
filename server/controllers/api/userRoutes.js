const router = require('express').Router();
const { User } = require('../../models');
const withAuth = require('../../utils/auth');
const bcrypt = require('bcrypt');

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
