const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    date:{
        type: Date,
        required: true,
    },
    price:{
        type: number,
        required: true,
    },
    totaltickets:{
        type: number,
        required: true,
    },
    availabletickets:{
        type: number,
        required: true,
    },
    organizer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imageURL:{
        type: String,
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Event', eventSchema);
