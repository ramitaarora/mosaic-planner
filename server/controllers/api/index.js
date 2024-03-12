const router = require('express').Router();

const homeRoutes = require('./homeRoutes');
router.use('/home', homeRoutes);

const userRoutes = require('./userRoutes');
router.use('/users', userRoutes);

const dataRoutes = require('./dataRoutes');
router.use('/data', dataRoutes);

const chatRoutes = require('./chatRoutes');
router.use('/chat', chatRoutes);

module.exports = router;