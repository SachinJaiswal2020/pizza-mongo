const express = require('express')
const app = express()
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const path = require('path')
const PORT = process.env.PORT || 8000
const mongoose = require('mongoose');

// if(process.env.PORT){
//     PORT = process.env.PORT;
// } else {
//     PORT = 3000;
// }


//MONGODB CONNECTION
const DB = 'mongodb+srv://sachinjaiswal:sachin@cluster0.iy1to.mongodb.net/pizza?retryWrites=true&w=majority';

mongoose.connect(DB, { useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology: true, useFindAndModify : true 
}).then(()=>{
    console.log('Database connected...');
}).catch(err => {
    console.log('Connection failed...')
});


//ASSEST
app.use(express.static('public'))

//Layout Template
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

//routers
require('./routes/web')(app)

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

