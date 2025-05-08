const express = require('express');
const router = express.Router();
const ActivityModel = require('../models/activity_model');
const protectedRoute = require('../middleware/protectedResouce');
const { body, validationResult } = require('express-validator');

router.get('/activities', (req, res) => {
    ActivityModel.find()
    .then(activities => {
        const listedActivities = activities.map(act => ({
            id: act._id,
            title: act.title,
            description: act.description,
            location: act.location,
        }));
        res.status(200).json({activities: listedActivities}); 
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({error: "Failed to Fetch activities"});
    });
});

router.post('/createactivity', protectedRoute, 
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('location').notEmpty().withMessage('Location is required'),
    (req, res) => {
    const { title, description, location } = req.body;

    if (!title || !description || !location) {
        return res.status(400).json({ error: "One or more mandatory fields are empty "});
    }

    req.user.password = undefined;

    const activityObj = new ActivityModel({ title: title, description: description, location: location, author: req.user._id});

    activityObj.save()
    .then((newActivity) => {
        res.status(201).json({ activity: newActivity });
    })
    .catch((error) => {
        consoleo.log(error);
    });
});

router.get("/myactivities", protectedRoute, (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: "User not authenticated" });
    }

    ActivityModel.find({ author: req.user._id })
        .populate("author", "_id name")
        .then((dbActivities) => {
            if (!dbActivities || dbActivities.length === 0) {
                return res.status(200).json({ activities: [] });
            }
            res.status(200).json({ activities: dbActivities });
        })
        .catch((error) => {
            // Log only critical errors
            if (error.message && !error.message.includes("some non-critical message")) {
                console.error("Critical error fetching activities:", error);
            }
            res.status(500).json({ error: "Failed to fetch activities" });
        });
});

module.exports = router;
