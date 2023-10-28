const express = require('express');
const router = express.Router();
const BLOG = require('../models/blog');
const auth = require('../middlewares/auth');


// blog create route
router.post('/', auth, async (req, res) => {
    try{
        const { title, content } = req.body;
        const owner = req.user._id;

        const blog = new BLOG({
            title,
            content,
            owner
        });
        await blog.save();

        res.status(201).json({
            message: 'Blog created successfully',
            blog
        });
    }
    catch(err){
        res.status(500).json({
            message: err.message
        });
    }
});


// get blog
router.get('/', auth, async (req, res) => {
    try{
        const blogs = await BLOG.find({ owner: req.user._id });

        if(blogs.length === 0){
            return res.status(404).json({
                message: 'No blog found'
            });
        }

        res.json({
            message: 'Blogs fetched successfully',
            blogs
        });
    }
    catch(err){
        res.status(500).json({
            message: err.message
        });
    }
});


// get blog by id
router.get('/:id', auth, async (req, res) => {
    try{
        const blog = await BLOG.findOne({ _id: req.params.id, owner: req.user._id });
        if(!blog){
            return res.status(404).json({
                message: 'Blog not found'
            });
        }

        res.json({
            message: 'Blog fetched successfully',
            blog
        });
    }
    catch(err){
        res.status(500).json({
            message: err.message
        });
    }
});


// update blog
router.patch('/:id', auth, async (req, res) => {
    try{
        const updates = Object.keys(req.body);
        const allowedUpdates = ['title', 'content'];

        const isValidUpdate = updates.every( (update) => allowedUpdates.includes(update) );
        if(!isValidUpdate){
            res.status(400).json({
                message: 'Invalid update'
            });
        }

        const blog = await BLOG.findOne({ _id: req.params.id, owner: req.user._id });
        if(!blog){
            return res.status(404).json({
                message: 'Blog not found'
            });
        }

        
        updates.forEach( (update) => blog[update] = req.body[update] );
        await blog.save();

        res.json({
            message: 'Blog updated successfully',
            blog
        });
    }
    catch(error){
        res.status(500).json({
            message: error.message
        });
    }
});


// delete blog
router.delete('/:id', auth, async (req, res) => {
    try{
        const blog = await BLOG.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if(!blog){
            return res.status(404).json({
                message: 'Blog not found'
            });
        }

        res.json({
            message: 'Blog deleted successfully',
            blog
        });
    }
    catch(err){
        res.status(500).json({
            message: err.message
        });
    }
});


module.exports = router;