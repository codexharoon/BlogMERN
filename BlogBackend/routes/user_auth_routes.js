const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const USER = require('../models/user');
const nodemailer = require('nodemailer');
require('dotenv').config();


// user register
router.post('/register', async (req, res) => {
    try{
        const { name, email, password } = req.body;

        const isUserExist = await USER.findOne({ email: email });
        if(isUserExist){
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        const user = new USER({
            name,
            email,
            password
        });
        await user.save();

        res.status(201).json({
            message: 'User created successfully',
            user
        });
    }
    catch(err){
        res.status(500).json({
            message: err.message
        });
    }
});


// user login
router.post('/login', async (req, res) => {
    try{
        const { email, password } = req.body;

        const isUserExist = await USER.findOne({ email: email });
        if(!isUserExist){
            return res.status(400).json({
                message: 'Invalid email or password'
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, isUserExist.password);
        if(!isPasswordCorrect){
            return res.status(400).json({
                message: 'Invalid email or password'
            });
        }

        const accessToken = jwt.sign({id : isUserExist._id}, process.env.JWT_SCRET_KEY);

        res.json({
            message: 'User logged in successfully',
            accessToken
        });
    }
    catch(err){
        res.status(500).json({
            message: err.message
        });
    }
});


// route for sending otp 

// -> createing nodemailer transporter
const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth:{
        user : process.env.EMAIL_ID,
        pass : process.env.EMAIL_APP_PASSWORD
    }
});

router.post('/sendotp', async (req, res) => {
    try{
        const {email} = req.body;

        const isUserExist = await USER.findOne({ email: email });
        if(!isUserExist){
            return res.status(400).json({
                message: 'No user found associated with this email'
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);

        transporter.sendMail(
            {
                from : process.env.EMAIL_ID,
                to : email,
                subject : 'Reset Password OTP',
                text : `Your OTP for verification is ${otp}`
            },
            async (err, info) => {
                if(err){
                    console.log(err);
                }
                else{
                    console.log(info);

                    isUserExist.otp = otp;
                    await isUserExist.save();
                    res.json({
                        message : 'OTP sent successfully',
                    });
                }
            }
        );
    }
    catch(err){
        res.status(500).json({
            message: err.message
        });
    }
});


// route for resetting password
router.post('/resetpassword', async (req, res) => {
    try{
        const {email , otp , password} = req.body;

        const isUserExist = await USER.findOne({ email: email });
        if(!isUserExist){
            return res.status(400).json({
                message: 'No user found associated with this email'
            });
        }

        if(!(otp === isUserExist.otp)){
            return res.status(400).json({
                message: 'Invalid OTP'
            });
        }

        isUserExist.password = password;
        isUserExist.otp = undefined;
        await isUserExist.save();


        res.json({
            message : 'Password reset successfully',
        });
    }
    catch(err){
        res.status(500).json({
            message: err.message
        });
    }
});




module.exports = router;
