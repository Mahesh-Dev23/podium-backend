const asyncHandler = require('express-async-handler')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/userModel')
const package = require('../package.json')



//console.log("8 ", User)

// package details versionetc.
const getpackage = (req, res) => {
    res.status(201).json({ package })
}

// @desc   Register a user
// @route  api/users
// @access public
const registerUser =  asyncHandler(async (req, res) =>{
    console.log(req.body)
    const { name, email, password, isAdmin, company, jobTitle, description } = req.body


    if(!name || !email || !password){
        res.status(400 )
        throw new Error('please include all fields')
    }

    // find if user already exits
    const userExits = await User.findOne({email})

    if(userExits){
         res.status(400 )
         throw new Error('user already exits')
    }

    // hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //create user

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        isAdmin,
        company,
        jobTitle,
        description
        
    })
    //console.log(user)
    if(user){
          res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    }else{
        res.status(400)
        throw new Error('Invalid user data')
    }

   // res.send('Router created!')
})

// @desc   Login a user
// @route  api/users
// @access public
const loginUser =  asyncHandler(async (req, res) =>{
    const { email, password } = req.body
    const user = await User.findOne({email})
    console.log("user controller", req.body)
    // check user and passwords match
    if(user && (await bcrypt.compare(password, user.password))){
        console.log( "user: " + user._id + " exists.") // working
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            company: user.company,
            jobTitle: user.jobTitle,
            description: user.description,
            token: generateToken(user._id)
        })
        
    }else{
        res.status(401)
        throw new Error('Invalid credential')
       
    }

    


    //res.send('Login created')
})

// generate token
const generateToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRETE,{
        expiresIn: '30d'
    })
}

const getMe =  asyncHandler(async (req, res) =>{
    const user = {
        id : req.user._id,
        email : req.user.email,
        name : req.user.name
    }

    res.status(200).json( req.user)

})

const editUser = asyncHandler( async (req, res) => {
    // const user = await User.findById(req.user.id)
     //console.log("controller ", req.body)
    // if(!user){
    //     res.status(401)
    //     throw new Error('user not found')
    // }
    const updateUser = await User.findByIdAndUpdate(req.body._id, req.body, { new:true })
    res.status(200).json(updateUser)
    //await console.log("user to edit", req.body)
})

// get all users
const getAllUsers = asyncHandler( async(req, res) => {
    const user = await req.user

    if(!user.isAdmin){
        res.status(401)
        throw new Error('user not authorsed')
    }

    const allUsers = await User.find(res)
     //console.log("allUsers ", req)
    res.status(201).json(allUsers)
})

module.exports = { registerUser, 
    loginUser,
    getMe,
    editUser,
    getAllUsers,
    getpackage,
}