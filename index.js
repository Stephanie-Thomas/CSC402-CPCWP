const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express;

//Connction to Mongoose
const MONGODB_URI = '';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedToplogy: true
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.log('Connection Error: ', err);
});

