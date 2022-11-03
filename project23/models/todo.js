const path = require ('path');
const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const todoSchema = new Schema({
    todo: {
        type: String,
        required: true
    }
});

module.exports = new mongoose.model('Todo', todoSchema);