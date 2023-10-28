const express = require('express');
const app = express();
const port = 8000;
const bodyParser = require('body-parser');
const cors = require('cors');
require('./db');
const userRoutes = require('./routes/user_auth_routes');
const blogRoutes = require('./routes/blog_routes');



app.use(cors());
app.use(bodyParser.json());

// home route
app.get('/', (req, res) => {
    res.json(
        {
            message : 'API is working'
        }
    );
});


// user routes
app.use('/users', userRoutes);

// blog routes
app.use('/blogs', blogRoutes);


// 404 error handler
app.use((req, res, next) => {
    res.status(404).json({
        message: 'Error 404 Page Not Found!'
    });
});


// server listening
app.listen(port, () => {
    console.log(`Blog app listening at http://localhost:${port}`);
});

