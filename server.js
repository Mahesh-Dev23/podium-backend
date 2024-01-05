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

 
 const whitelist = ['https://podium-demo-three.vercel.app', 'http://localhost:3000/']
 const corsOptions = {
    origin: function (origin, callback) {
          if (whitelist.indexOf(origin) !== -1) {
          callback(null, true)
          } else {
          callback(new Error('Not allowed by CORS'))
          }
          },
    headers: {
            Authorization: 'Bearer ' + process.env.vercelToken,
        }
 }


 app.use(cors(corsOptions))
 app.use(express.json())
 app.use(express.urlencoded({extended:false}))
 
 
 
// https://podium-backend.vercel.app
//  app.use((req, res, next) => {
//     // res.setHeader("Access-Control-Allow-Origin", "https://podium-demo-three.vercel.app");
//     // res.header(
//     //   "Access-Control-Allow-Headers",
//     //   "Origin, X-Requested-With, Content-Type, Accept"
//     // );
//     // res.header('Access-Control-Allow-Origin', 'https://podium-demo-three.vercel.app');
//     // res.header('Access-Control-Allow-Headers', '*');
//     // res.header('Access-Control-Allow-Credentials', 'true');
//     // res.header('Content-Type', 'application/json');
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    
//     next();
//   });
  

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
        
        
        console.log('Logged In from https://podium-backend.vercel.app', data)
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
 
}); 

 
 


 // serve frontend

 if(process.env.NODE_ENV === 'production' ){
    app.use(express.static(path.join(__dirname, '../build')))
    // res.status(200).send("Welcome to Podium - DIY Virtual Meets")
    app.get('*', (req, res) =>{ 
        res.sendFile(__dirname, './',  'build', 'index.html')
        // res.sendFile(__dirname, './',  'index.html')
    })
 }else{
    app.get('/', (req, res)=>{
        res.status(200).send("Welcome to Podium - DIY Virtual Meets")
        
        // res.sendFile( __dirname, './',  'index.html')
    })
 }

 app.use(errorHandler)

 httpServer.listen(PORT, ()=>{
     console.log(`This is express server running on port: ${PORT}`)
     console.log(`Socket IO connected on: ${PORT}`)
 })



 
console.log("this is server...")


// https://data.mongodb-api.com/app/data-tukjf/endpoint/data/v1