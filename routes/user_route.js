const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const UserModel = mongoose.model('UserModel');
const { JWT_SECRET } = require('../config')
const { body, validationResult } = require('express-validator');

router.post('/register',  
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('phoneNumber').isLength({ min: 10, max: 10 }).withMessage('Phone number must be 10 digits'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'), (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    const { name, email, phoneNumber, password } = req.body;


    if (!name || !email || !phoneNumber || !password) {
        return res.status(400).json({ error: "One or more fields are empty" });
    }

    UserModel.findOne({ email: email })
        .then((userEmail) => {
            if (userEmail) {
                res.status(500).json({ error: "User with this email already exists" });
                return Promise.reject("Stop chain");
            } else {
                return UserModel.findOne({ phoneNumber: phoneNumber });
            }
        })
        .then((userphoneNumber) => {
            if (userphoneNumber) {
                res.status(500).json({ error: "User with this Phone Number already exists" });
                return Promise.reject("Stop chain");
            }

            return bcryptjs.hash(password, 16);
        })
        .then((hashedPassword) => {
            const user = new UserModel({ name, email, phoneNumber, password: hashedPassword });
            return user.save();
        })
        .then((newUser) => {
            res.status(201).json({ result: "User signed up Successfully" });
        })
        .catch((err) => {
            if (err === "Stop chain") {
                return;
            }
            console.log(err);
            res.status(500).json({ error: "Something went wrong" });
        });
});

router.post('/login',     
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "One or more fields are empty" });
    }
    UserModel.findOne({ email: email })
        .then((userInDB) => {
            if (!userInDB) {
                return res.status(401).json({ error: "Invalid Credentials" });
            }
            bcryptjs.compare(password, userInDB.password)
                .then((didMatch) => {
                    if (didMatch) {
                        const jwtToken = jwt.sign({ _id: userInDB._id }, JWT_SECRET);
                        const userInfo = { "email": userInDB.email, "name": userInDB.name };

                        res.status(201).json({ result: { token: jwtToken, user: userInfo } });
                    } else {
                        return res.status(401).json({ error: "Invalid Credentials" });
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        })
        .catch((error) => {
            console.log(error);
        })
});

module.exports = router;
