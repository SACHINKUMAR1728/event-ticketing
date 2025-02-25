const jwt = require('jsonwebtoken');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');


const registerUser = asyncHandler(async (req, res)=>{
    const {name, email, password} = req.body;

    const userExists = await User.findone({email});
    if(userExists){
        res.status(400);
        throw new Error('User already exists');
    }
    const user = await User.create({name, email, password});

    const token = jwt.sign({id: user._id},process.env.JWT_SECRET,{ expiresIn: '15d'});

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token
    });
});

const loginUser = asyncHandler(async (req, res)=>{
    const {email,password} = req.body;

    const user = await User.findOne({email});
    if(user && (await user.matchPassword(password))){
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '15d'});
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token
        });

    }
    else{
        res.status(401);
        throw new Error('Invalid email or password');
    }
});


module.exports = {registerUser, loginUser};