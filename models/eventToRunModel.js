const mongoose = require('mongoose')

const eventToRunSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    data: {
        type: Object,
        required: true
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
    },
    speakers: {
        type: Array,
        required: false
    }
},
{
    timestamps: true,
})

module.exports = mongoose.model('eventToRun', eventToRunSchema)