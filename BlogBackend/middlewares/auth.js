const jwt = require('jsonwebtoken');
const USER = require('../models/user');
require('dotenv').config();


const auth = async (req, res, next) => {
    try{
        const accessToken = req.header('Authorization').replace('Bearer ', '');
        const decodeToken = jwt.verify(accessToken, process.env.JWT_SCRET_KEY);

        const user = await USER.findOne({ _id: decodeToken.id});
        if(!user){
            throw new Error('invalid user');
        }

        req.user = user;
        req.accessToken = accessToken;
        next();
    }
    catch(err){
        res.status(500).json({
            message: err.message
        });
    }
};

module.exports = auth;


