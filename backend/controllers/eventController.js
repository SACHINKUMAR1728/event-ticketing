const Event = require('../models/event');
const asyncHandler = require('express-async-handler');

const createEvent = asyncHandler(async (req, res)=>{
    const {title, description, date,venue, price, totaltickets, imageURL} = req.body;

    const organizer = req.user._id;

    const event = await Event.create({
        title, 
        description, 
        date,
        venue,
        price, 
        totaltickets, 
        availabletickets: totaltickets, 
        imageURL, 
        organizer
    });


    res.status(201).json(event);
});

const getEvents = asyncHandler(async (req, res)=>{
    const events = await Event.find({}).populate('organizer', 'name email');
    res.json(events);
});

module.exports = {createEvent, getEvents};