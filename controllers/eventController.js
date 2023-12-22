const asyncHandler = require('express-async-handler')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/userModel')
const Event = require('../models/eventModel')
const EventToRun = require('../models/eventToRunModel')

// @desc   Create an Event
// @route  post api/events
// @access private
const createEvent =  asyncHandler(async (req, res) =>{

    const { name, date, time, eventcat, eventList, eventHost, status } = req.body

    if(!name){
        res.status(401)
        throw new Error( 'Please provide Event Title')
    }

    const user = await User.findById(req.user.id)

    if(!user){
        res.status(401)
        throw new Error('user not found')
    }

    const event = await Event.create({
        name, 
        date, 
        time, 
        eventcat,
        eventList,
        eventHost : req.user.id, 
        status : 'new'
    })
    
    res.status(201).json(event)


    //res.status(200).json({ message: 'Create Event' })
})

// @desc   Gete all Events
// @route  get api/events
// @access private
const getEvents =  asyncHandler(async (req, res) =>{

    const user = await User.findById(req.user.id)

    if(!user){
        res.status(401)
        throw new Error('user not found')
    }

    const events = await Event.find( {eventHost : req.user.id} )

    res.status(201).json(events)
    
    //res.status(200).json({ message: 'Get Event' })
})

// @desc   Get an Event
// @route  get api/events/:id
// @access private
const getSIngalEvents =  asyncHandler(async (req, res) =>{

    const user = await User.findById(req.user.id)

    if(!user){
        res.status(401)
        throw new Error('user not found')
    }

    const singalEvent = await Event.findById( req.params.id )

    if(!singalEvent){
        res.status(404)
        throw Error('Event not found')
    }

    if(singalEvent.eventHost.toString() !== req.user.id){
        res.status(401)
        throw Error ("Not Authorised")
    }

    res.status(200).json(singalEvent)
    
    //res.status(200).json({ message: 'Get Event' })
})

// @desc   Get an Event by Name
// @route  get api/events/:name
// @access public
const getEventByname =  asyncHandler(async (req, res) =>{
    //console.log("event Controller get Event by Name", req.params.name)
    

    const singleEvent = await EventToRun.findOne({name: req.params.name})
    //const singalEvent = await EventToRun.find()
    if(!singleEvent){
        res.status(404)
        throw Error('Event not found')
    }

    
    //console.log("singleEvent ", singleEvent)
    res.status(200).json(singleEvent)
    
    //res.status(200).json({ message: 'Get Event' })
})


// @desc   Delete an Event
// @route  DELETE api/events/:id
// @access private
const removeEvent =  asyncHandler(async (req, res) =>{

    const user = await User.findById(req.user.id)

    if(!user){
        res.status(401)
        throw new Error('user not found')
    }

    const singalEvent = await Event.findById( req.params.id )

    if(!singalEvent){
        res.status(404)
        throw Error('Event not found')
    }

    if(singalEvent.eventHost.toString() !== req.user.id){
        res.status(401)
        throw Error ("Not Authorised")
    }

    await singalEvent.remove()
    res.status(200).json({ success : `${singalEvent.name} deleted`})
    
    //res.status(200).json({ message: 'Get Event' })
})

// @desc   Update an Event
// @route  PUT api/events/:id
// @access private
const updateEvent =  asyncHandler(async (req, res) =>{

    const user = await User.findById(req.user.id)

    if(!user){
        res.status(401)
        throw new Error('user not found')
    }

    const singalEvent = await Event.findById( req.params.id )

    if(!singalEvent){
        res.status(404)
        throw Error('Event not found')
    }

    if(singalEvent.eventHost.toString() !== req.user.id){
        res.status(401)
        throw Error ("Not Authorised")
    }

    const updateEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new:true })
    res.status(200).json(updateEvent)
    
    //res.status(200).json({ message: 'Get Event' })
})

// @desc   run event
// @route  put api/events

const runEvent =  asyncHandler(async (req, res) =>{

    const eventtorunFind = await EventToRun.find({name : req.body.eventData.name})
    // console.log("Body ", req.body.speakers)
    let eventrun
    if( eventtorunFind.length === 0 ){
        console.log("Create")
        eventrun = await EventToRun.create({
            name : req.body.eventData.name, 
            data: req.body.eventData,
            eventRun: req.body.eventRun,
            selectedDesign: req.body.selectedDesign,
            mode: req.body.mode,
            colors: req.body.colors,
            speakers: req.body.speakers
        })
        //console.log(req.body.name)
    }else{
        console.log("Update")
       eventrun = await EventToRun.updateOne({
            name : req.body.eventData.name, 
            data: req.body.eventData,
            eventRun: req.body.eventRun,
            selectedDesign: req.body.selectedDesign,
            mode: req.body.mode,
            colors: req.body.colors,
            speakers: req.body.speakers})
       //console.log("updated", req.body)
    }
    

    res.status(201).json(eventrun)
    
    //res.status(200).json({ message: req.body })
})


module.exports = { createEvent,
    getEvents,
    getSIngalEvents,
    removeEvent,
    updateEvent,
    runEvent,
    getEventByname,
}