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

// if(process.env.PORT){
//     PORT = process.env.PORT;
// } else {
//     PORT = 3000;
// }


//MONGODB CONNECTION
require('./DB/conn')

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


app.use(flash())

//ASSEST
app.use(express.static('public'))
app.use(express.json())


//GLOBAL MIDDLEWARE
app.use((req,res,next) =>{
    res.locals.session = req.session
    next()
})

//Layout Template
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

//routers
require('./routes/web')(app)

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

