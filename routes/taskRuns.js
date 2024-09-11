const express = require('express');
const router = express.Router();
const TaskRun = require('../models/taskRun'); // Import the TaskRun model
const { body, validationResult } = require('express-validator');

// Fetch all task runs
router.get('/', async (req, res) => {
    try {
        const taskRuns = await TaskRun.find();
        res.json(taskRuns);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Fetch a specific task run by ID
router.get('/:id', async (req, res) => {
    try {
        const taskRun = await TaskRun.findById(req.params.id);
        if (taskRun) {
            res.json(taskRun);
        } else {
            res.status(404).json({ message: 'Task run not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new task run (with validation)
router.post('/', [
    body('startTime').isISO8601().withMessage('Invalid start time'),
    body('status').isIn(['in-progress', 'completed']).withMessage('Invalid status'),
    body('endTime').optional().isISO8601().withMessage('Invalid end time'),
    body('runtime').optional().isInt({ min: 0 }).withMessage('Invalid runtime'),
    body('filesAdded').optional().isArray().withMessage('Files added should be an array'),
    body('filesDeleted').optional().isArray().withMessage('Files deleted should be an array'),
    body('magicStringOccurrences').optional().isInt({ min: 0 }).withMessage('Invalid magic string occurrences'),
], async (req, res) => {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { startTime, endTime, runtime, filesAdded, filesDeleted, magicStringOccurrences, status } = req.body;

    try {
        const taskRun = new TaskRun({
            startTime,
            endTime,
            runtime,
            filesAdded,
            filesDeleted,
            magicStringOccurrences,
            status
        });
        const savedTaskRun = await taskRun.save();
        res.status(201).json(savedTaskRun);
    } catch (err) {
        console.error('Error creating task run:', err); // Log error for debugging
        res.status(500).json({ message: err.message });
    }
});

// Update a specific task run by ID
router.put('/:id', [
    body('startTime').optional().isISO8601().withMessage('Invalid start time'),
    body('endTime').optional().isISO8601().withMessage('Invalid end time'),
    body('status').optional().isIn(['success', 'failed', 'in-progress', 'completed']).withMessage('Invalid status'),
    // Add more validations as needed
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { startTime, endTime, runtime, filesAdded, filesDeleted, magicStringOccurrences, status } = req.body;

    try {
        const taskRun = await TaskRun.findByIdAndUpdate(
            req.params.id,
            { startTime, endTime, runtime, filesAdded, filesDeleted, magicStringOccurrences, status },
            { new: true, runValidators: true } // Return the updated document and validate on update
        );

        if (taskRun) {
            res.json(taskRun);
        } else {
            res.status(404).json({ message: 'Task run not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a specific task run by ID
router.delete('/:id', async (req, res) => {
    try {
        const result = await TaskRun.findByIdAndDelete(req.params.id);
        if (result) {
            res.json({ message: 'Task run deleted' });
        } else {
            res.status(404).json({ message: 'Task run not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
