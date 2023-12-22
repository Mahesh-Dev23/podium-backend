const mongoose = require('mongoose')

const eventSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    eventcat: {
        type: String,
        required: true
    },
    eventHost: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'

    },
    eventList: {
        type: Array,
        required: true
    },
    eventToRun:{
        type: Object,
        required:false
    },
    panelist:{
        type: Array,
        required: false
    },
    days:{
        type: Number,
        required: false
    },
    status: {
        type: String,
        required: false,
        enum: ['new', 'Flow', 'Panelist', 'DryRun', 'Invitest', 'PreLive', 'Live', 'Completed'],
        default:'new'
    },
    eventRun: {
        type: Object,
        required: false
    },
    selectedDesign: {
        type: String,
        required: false,
        default: 'Circle'
    },
    mode: {
        type: Boolean,
        required: false,
        default: true
    },
    colors: {
        type: Object,
        required: false
    }
},
{
    timestamps: true,
})

module.exports = mongoose.model('Event', eventSchema)