const router = require('express').Router();
const { Posts, User, Comments } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/comment', withAuth, async (req, res) => {
    try {
        const commentData = await Comments.create({
            comment_content: req.body.comment_content, 
            post_id: req.body.post_id,
            author_id: req.session.user_id,
        })
        res.json(commentData);
    } catch (err) {
        res.status(400).json(err);
    }
})

router.post('/add', withAuth, async (req, res) => {
    try {
        const blogPostData = await Posts.create( {
            post_name: req.body.post_name,
            post_content: req.body.post_content,
            author_id: req.session.user_id,
        });
        res.status(200).json(blogPostData);
    } catch (err) {
        res.status(400).json(err);
    }
})

router.put('/edit', withAuth, async (req, res) => {
    try {
        const blogPostData = await Posts.update(
            {
                post_name: req.body.post_name,
                post_content: req.body.post_content,
                author_id: req.session.user_id,
            },
            {
                where: {
                    id: req.body.id,
                }
            }
        )
        res.status(200).json(blogPostData)
    } catch(err) {
        res.status(400).json(err)
    }
    
})

router.delete('/delete/:id', withAuth, async (req, res) => {
    try {
        const blogPostData = await Posts.destroy( { 
            where: { 
                id: req.params.id,
            }
        });
        res.status(200).json(blogPostData);
    } catch (err) {
        res.status(400).json(err);
    }
})

module.exports = router;