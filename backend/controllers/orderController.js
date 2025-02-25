const Order = require('../models/order');
const razorpay = require('razorpay');
const asyncHandler = require('express-async-handler');
const Event = require('../models/event');


const createOrder = asyncHandler(async (req, res)=>{
    const {eventID, tickets} = req.body;
    const event = await Event.findById(eventID);

    if(!event){
        res.status(404);
        throw new Error('Event not found');
    }
    const amount = event.price * tickets;

    const order = await razorpay.order.create({
        amount : amount * 100,
        currency: 'INR',
        reciept :`order_$(Date.now())`,
    });

    const dbOrder = await Order.create({
        user: req.user._id,
        event: eventID, 
        tickets,
        totalAmount: amount,
        transactionID   : order.id
    });
    res.status(201).json(
        {
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID
        }
    );
});


const verifyPayment = asyncHandler(async (req, res)=>{
    const {razorpay_payment_id, razorpay_order_id, razorpay_signature} = req.body;

    const crypto = require('crypto');
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

    if(expectedSignature !== razorpay_signature){
        res.status(400);
        throw new Error('Invalid Signature');
    }
    const order = await Order.findOneAndUpdate({transactionID: razorpay_order_id}, {payementStatus: 'completed'},{new: true}).populate('event');

    await Event.findByIdAndUpdate(order.event._id, {$inc: {availabletickets: -order.tickets}});

    res.json({message: 'Payment Successfull',success: true});
});

module.exports = {createOrder, verifyPayment};