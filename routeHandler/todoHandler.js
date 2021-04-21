const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const todoSchema = require('../schemas/todoSchema');
const Todo = new mongoose.model("Todo", todoSchema);

// GET ALL THE TODOS
router.get('/', async(req, res) => {
    await Todo.find({status: 'inactive'})
        .select({
            _id: 0,
            date: 0
        })
        .limit(5)
        .exec((err, data) => {
            if(err) {
                res.status(500).json({
                    error: "There was a server side error!"
                });
            } else {
                res.status(200).json({
                    results: data,
                    message: "success!"
                });
            }
        });
});

// GET A TODO BY ID
router.get('/:id', async(req, res) => {
    try {
        const data = await Todo.find({_id: req.params.id});
        res.status(200).json({
            results: data,
            message: "success!"
        });
    } catch (error) {
        res.status(500).json({
            error: "There was a server side error!"
        }); 
    }
});

// POST A TODO
router.post('/', async(req, res) => {
    const newTodo = new Todo(req.body);
    await newTodo.save((err => {
        if(err) {
            res.status(500).json({
                error: "There was a server side error!"
            });
        } else {
            res.status(200).json({
                message: "Todo was inserted successfully!"
            });
        }
    }));
});

// POST MULTIPLE TODO
router.post('/all', async(req, res) => {
    await Todo.insertMany(req.body, (err) => {
        if(err) {
            res.status(500).json({
                error: "There was a server side error!"
            });
        } else {
            res.status(200).json({
                message: "Todos were inserted successfully!"
            });
        }
    });
});

// PUT TODO
router.put('/:id', async(req, res) => {
    const result = await Todo.findByIdAndUpdate(
        {_id: req.params.id}, 
        {
            $set: {
                status: 'inactive',
                title: 'Update 2'
            }
        },
        {
            new: true,
            useFindAndModify: false
        }, 
        (err) => {
            if(err) {
                res.status(500).json({
                    error: "There was a server side error!"
                });
            } else {
                res.status(200).json({
                    message: "Todo was updated successfully!"
                });
            }
        }
    );

    console.log(result);
});

// DELETE TODO
router.delete('/:id', async(req, res) => {
    await Todo.deleteOne({_id: req.params.id}, (err) => {
        if(err) {
            res.status(500).json({
                error: "There was a server side error!"
            });
        } else {
            res.status(200).json({
                message: "Todo was deleted successfully!"
            });
        }
    });
});

module.exports = router;