const router = require('express').Router();

const userRoutes = require('./userRoutes');
router.use('/users', userRoutes);

const blogRoutes = require('./blogRoutes');
router.use('/blog', blogRoutes);

module.exports = router;