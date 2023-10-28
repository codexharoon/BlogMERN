const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
    },
    owner:{
        type : mongoose.Schema.Types.ObjectId,
        required: true,
        ref : 'User'
    }
},
{
    timestamps: true

});

module.exports = mongoose.model('Blog', blogSchema);