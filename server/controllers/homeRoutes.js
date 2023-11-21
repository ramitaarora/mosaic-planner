const router = require('express').Router();
const { Posts, User, Comments } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    const blogPostData = await Posts.findAll({
        include: [{model: User}],
    });

    const blogPosts = blogPostData.map(post => post.get({plain:true}));
    // console.log(blogPosts);

    res.render('homepage', {
        logged_in: req.session.logged_in,
        blogPosts,
    });
});

router.get('/login', (req, res) => {
    if (!req.session.logged_in) {
        res.render('login');
    } else {
        res.redirect('/', {logged_in: req.session.logged_in});
    }
});

router.get('/signup', (req, res) => {
    if (!req.session.logged_in) {
        res.render('signup');
    } else {
        res.redirect('/', {logged_in: req.session.logged_in});
    }
});

router.get('/dashboard', async (req, res) => {
    if (!req.session.logged_in) {
        res.render('login');
    } else {
        const blogPostData = await Posts.findAll({
            include: [{model: User}],
            where: {
                author_id: req.session.user_id
            }
        });
    
        const blogPosts = blogPostData.map(post => post.get({plain:true}));
        console.log(blogPosts);
        res.render('dashboard', {
            logged_in: req.session.logged_in,
            blogPosts,
        });
    }
});

router.get('/post/:id', async (req, res) => {
    try {
        const blogPostData = await Posts.findOne( { where: { id: req.params.id }, 
        include: [{model:User}]
        });
        // console.log(blogPostData);
        const blogPost = blogPostData.get({plain: true});
        // console.log (blogPost);

        const commentData = await Comments.findAll( { where: { post_id: req.params.id},
            include: [{model: User}]
        })
        const comments = commentData.map((comment => comment.get({plain:true})));
        // console.log(comments);

        res.render('post', {
            blogPost,
            comments,
            logged_in: req.session.logged_in,
        });

    } catch (err) {
        res.status(400).json(err);
    }
});

router.get('/edit/:id', withAuth, async (req, res) => {
    try {
        const blogPostData = await Posts.findOne( { where: { id: req.params.id }, 
        include: [{model:User}]
        });
        // console.log(blogPostData);
        const blogPost = blogPostData.get({plain: true});
        // console.log(blogPost);

        res.render('editPost', {
            blogPost,
            logged_in: req.session.logged_in,
        });

    } catch (err) {
        res.status(400).json(err);
    }
})

router.get('/newPost', withAuth, (req, res) => {
    res.render('newPost', { logged_in: req.session.logged_in} );
})

module.exports = router;