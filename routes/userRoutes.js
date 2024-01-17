const express = require('express')
const router = express.Router()
const cors = require('cors')
const { registerUser, loginUser, getMe, editUser, getAllUsers, getpackage } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

const headers = {
    'Access-Control-Allow-Origin': 'https://podium-demo-three.vercel.app',
    'Access-Control-Allow-Headers': '*',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
}

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)
router.put('/:id',  editUser)
router.get('/', protect, getAllUsers)
router.get('/package', getpackage)
module.exports = router
