const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    event:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    tickets:{
        type: Number,
        required: true
    },
    payementStatus:{
        type: String,
        enum: ['pending','completed','failed'],
        default: 'pending'
    },
    transactionID:{
        type: String,
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);
