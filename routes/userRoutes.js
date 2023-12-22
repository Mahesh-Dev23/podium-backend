const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getMe, editUser, getAllUsers, getpackage } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)
router.put('/:id',  editUser)
router.get('/', protect, getAllUsers)
router.get('/package', getpackage)
module.exports = router
