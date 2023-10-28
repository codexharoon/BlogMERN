const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URL,
    {
        dbName: process.env.MONGO_DB_NAME,
    },
).then(() => {
    console.log('Connected to database');
}).catch((e) => {
    console.log('database Connection failed, '+e.message);
});