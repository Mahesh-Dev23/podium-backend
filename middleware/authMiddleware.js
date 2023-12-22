const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const User = require('../models/userModel')

const protect = asyncHandler( async (req, res, next)=> {
    let token

    if( req.headers.authorization && req.headers.authorization.startsWith('Bearer')){

        try{
            token = req.headers.authorization.split(' ')[1]

            const decoded = jwt.verify(token, process.env.JWT_SECRETE)

            req.user = await User.findById(decoded.id).select('-password')

            next()

        }catch(err){
            console.log(err)
            res.status(401)
            throw new Error('Not Authorised')
        }
       

    }

    if(!token){
        //console.log("no token")
        res.status(401)
        throw new Error('Not Authorised')
    }
})

module.exports = { protect }