const router = require('express').Router();
const { User } = require('../models');
const withAuth = require('../utils/auth');

// router.get('/', (req, res) => {
//     if (req.session.logged_in) {
//         res.json( {"loggedIn" : true} );
//     } else {
//         res.json( {"loggedIn" : true} );
//     }
// })

// router.get('/login', (req, res) => {
//     if (!req.session.logged_in) {
//         res.render('login');
//     } else {
//         res.redirect('/', {logged_in: req.session.logged_in});
//     }
// });

// router.get('/signup', (req, res) => {
//     if (!req.session.logged_in) {
//         res.render('signup');
//     } else {
//         res.redirect('/', {logged_in: req.session.logged_in});
//     }
// });

// router.get('/logout', (req, res) => {
//     req.session.destroy((err) => {
//       if (err) {
//         console.error(err);
//       } else {
//         res.redirect('/');
//       }
//     });
//   });

module.exports = router;