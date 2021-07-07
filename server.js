const dotenv = require('dotenv')
dotenv.config({ path: './config.env' });
const express = require('express')
const app = express()
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const path = require('path')
const PORT = process.env.PORT || 8000
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')
const passport = require('passport')
const Emitter = require('events')

// if(process.env.PORT){
//     PORT = process.env.PORT;
// } else {
//     PORT = 3000;
// }


//MONGODB CONNECTION
require('./DB/conn')


//Event Emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)


//SESSION CONFIG & SESSION STORE
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoDbStore.create({
        mongoUrl: process.env.DATABASE
    }),
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 *24 }
})
)


//PASSPORT CONFIG
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())


//USED FOR FLASH MESSAGES IN LOGIN AND REGISTER
app.use(flash())


//ASSEST
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('public'))


//GLOBAL MIDDLEWARE
app.use((req,res,next) =>{
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})


//Layout Template
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

//routers
require('./routes/web')(app)
app.use((req,res) =>{
    res.status(404).render('errors/404')
})

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

//Socket
const io = require('socket.io')(server)
io.on('connection', (socket) => {
    // console.log(socket.id)
    socket.on('join', (orderId) => {
        // console.log(orderId)
        socket.join(orderId)
    })
})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})