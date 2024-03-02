const router = require('express').Router();

router.get('/', async (req, res) => {
    if (req.session.logged_in) {
        res.json( {"loggedIn" : true} );
    } else {
        res.json( {"loggedIn" : false} );
    }
})

module.exports = router;