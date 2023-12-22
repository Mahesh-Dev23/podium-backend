const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password']
    },
    isAdmin: {
        type: Boolean,
        required: false,
        default: false
    },
    company:{
        type: String,
        required: [true, 'Organisation']
    },
    jobTitle: {
        type: String,
        required: [true, 'Please add job title'],
        
    },
    description: {
        type: String,
        required: false
    }
},
{
    timestamps: true,
})

module.exports = mongoose.model('User', userSchema)