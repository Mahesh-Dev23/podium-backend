 const express = require('express')
 const { createServer } = require("http");
 const { Server } = require("socket.io")
 const path = require('path')
 const dotenv = require('dotenv').config()
 const cors = require('cors')
 const { errorHandler } = require('./middleware/errorMiddleware')

 const PORT = process.env.PORT || 5000
 const connectDB = require('./config/db')
 const app = express()
 app.use(cors())
 app.use(express.json())
 app.use(express.urlencoded({extended:false}))

 app.use('/api/users', require('./routes/userRoutes'))
 app.use('/api/events', require('./routes/eventRoutes'))

 const httpServer = createServer(app)

 
 connectDB()

 
 // ws scoket io data exhange ---------------------------------

 const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  let room = ''
  let roomData = {}
  let message = ''
  let loggedUsers = []
  let admin = ''
  let user = {}
  let onePerson = ''

io.on("connection", (socket) => {
    socket.on('Logged In', (data)=> {
        
        
        // console.log('Logged In ', data)
        user = data
        

        // login first speaker
        if(loggedUsers.length === 0) {
            loggedUsers.push(data.name)
            socket.join([ data.room, data.name ])
            console.log('Logged In ', data)
            io.in( data.room ).emit('Welcome', data)
            io.in(user.room).emit('loggedUsers', loggedUsers)
        } 

        // check if speaker is alrready logged in 
        if(loggedUsers.includes(data.name)) {
            console.log("user is already logged in")
        } else{
            loggedUsers.push(data.name)
            socket.join([ data.room, data.name ])
            console.log('Logged In ', data)
            io.in( data.room ).emit('Welcome', data)
            io.in(user.room).emit('loggedUsers', loggedUsers)
        } 
        
        
    })

    
    socket.on('Admin', (data) => {
        admin = data.name
    })

    socket.on('Slide to', (data) => {
        console.log('Slide to ', data)
        io.in(user.room).emit('go to', data)
    })

    // set single receiver admin to send individaul message
    socket.on('one paticipant', (data) => {
        console.log('one paticipant ', data)
        onePerson = data.name
    })

    // 
    socket.on('paticipant', (data) => {
        console.log("onePerson ", onePerson)
        console.log('paticipant ', data)

        if(onePerson === '' && data.name === admin ){
            // admin to send message to all
            console.log("From Admin to All! ")
            io.in(user.room).emit('paticipant reply', data)
            // io.in(admin).emit('paticipant reply', data)


        }else if( onePerson === '' && data.name !== admin ) {
            // participant to send message to Admin and self
            console.log("To Admin ", data.name)
            io.in(data.name).emit('one person', data)
            io.in(admin).emit('one person', data)

        } else {
            // admin to send individaul message
            console.log("From Admin ", onePerson)
            io.in(onePerson).emit('one person', data)
            io.in(admin).emit('one person', data)
            onePerson = ''
        }
        
    })

    console.log(onePerson)
    console.log(loggedUsers)

    socket.on('logout', data => {
        
        if(data.name === '' || data.msg === '') return console.log("logout 122")
        
        let newLoggedUser = []
        loggedUsers.filter( res => {  
            if( loggedUsers.includes(data.name) ) {
                console.log("logout 128", data)
                io.in(user.room).emit( 'loggedOutUsers', data)
            }else{
                newLoggedUser.push(res)
            }
        })

        loggedUsers = []
        loggedUsers = newLoggedUser

        io.in(user.room).emit('loggedUsers', loggedUsers)
        
        
    })
    // socket.on('disconnect', (data)=>{
    //     console.log(`${user.name} is disconnected! ${data}`)
    //     io.in(user.room).emit('disconnected', user.name)
    //     // console.log(data)
    //     let newLoggedUser = []
    //     loggedUsers.filter( res => { 
    //         if(loggedUsers.includes(user.name)) return
    //         if(res !== user.name ) return newLoggedUser.push(res)
    //     })

    //     loggedUsers = []
    //     loggedUsers = newLoggedUser

    //     io.in(user.room).emit('loggedUsers', loggedUsers)
    // })
   
    // if(Object.keys(socket.data).length !== 0)
    // console.log("socket data ", socket.data)
}); 

 //io.in(roomData.room).emit("welcome", message)
//  if(Object.keys(roomData).length !== 0){
//     io.in(roomData.room).emit("go to", roomData.index)
//  }
 


 // serve frontend

 if(process.env.NODE_ENV === 'production' ){
    app.use(express.static(path.join(__dirname, '../frontend/build')))

    app.get('*', (req, res) =>{ 
        res.sendFile(__dirname, '../', 'frontend', 'build', 'index.html')
    })
 }else{
    app.get('/', (req, res)=>{
        res.status(200).send("Welcome to Podium - DIY Virtual Meets")
        
    })
 }

 app.use(errorHandler)

 httpServer.listen(PORT, ()=>{
     console.log(`This is express server running on port: ${PORT}`)
     console.log(`Socket IO connected on: ${PORT}`)
 })






 
console.log("this is server...")