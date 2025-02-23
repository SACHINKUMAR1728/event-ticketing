const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

mongoose.connect(process.env.MONGODB_URI).then(()=> console.log('DB connected')).catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);


const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{console.log(`Server is running on port ${PORT}`)});

