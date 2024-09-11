const express = require('express');
const router = express.Router();
const Config = require('../models/config');  // Import the Config model
const { body, validationResult } = require('express-validator');

// Fetch the current configuration
router.get('/', async (req, res) => {
    try {
        const config = await Config.findOne();
        console.log('Configuration fetched:',config);
        if (!config) {
            return res.status(404).json({ message: 'Configuration not found' });
        }
        res.json(config);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update configuration settings
router.put('/', [
    body('directoryPath').isString().withMessage('Directory path must be a string'),
    body('interval').isInt({ min: 1000 }).withMessage('Interval must be at least 1000ms'),
    body('magicString').isString().withMessage('Magic string must be a string')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { directoryPath, interval, magicString } = req.body;

    try {
        let config = await Config.findOne();
        if (!config) {
            config = new Config({ directoryPath, interval, magicString });
        } else {
            config.directoryPath = directoryPath;
            config.interval = interval;
            config.magicString = magicString;
        }

        await config.save();
        res.json({ message: 'Configuration updated', config });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
