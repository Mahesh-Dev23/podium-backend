const express = require('express')
const router = express.Router()
const { getEvents, createEvent, getSIngalEvents, updateEvent, removeEvent, runEvent, getEventByname } = require('../controllers/eventController')
const { protect } = require('../middleware/authMiddleware')

router.route('/name/:name').get(getEventByname)

router.route('/run').post( runEvent )

router.route('/').get( protect, getEvents).post(protect, createEvent)

router.route('/:id').get(protect, getSIngalEvents)

router.route('/:id').delete(protect, removeEvent)

router.route('/:id').put(protect, updateEvent)



module.exports = router
