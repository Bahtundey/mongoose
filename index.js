const express = require('express');
const app = express();
const port = process.env.PORT || 3600; 
const ejs = require('ejs')
app.set('view engine', 'ejs')
const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')
const MongoDB_URI = process.env.MongoDB_URI
mongoose.connect(MongoDB_URI)
.then(()=>{
    console.log('connected to MongoDB')
}).catch((err)=>{
    console.log('You are not connected', err)
})

app.use(express.urlencoded({extended:true}));

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'firstname is required'],
        trim: true,
    },

    lastname: {
        type: String,
        required: [true, 'lastname is required'],
        trim: true,
    },

    email: {
        type: String,
        required: [true, 'firstname is required'],
        unique: [true, 'email already exists'],
        trim: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: [true, 'password is required'],
        trim: true,
    },

})
const User = mongoose.model('User', userSchema);


app.post('/signup', (req, res)=>{
    const {firstname, lastname, email, password} = req.body;

    const newUser = new User({
        firstname,
        lastname,
        email,
        password,
    });

    newUser.save()
    .then(()=>{
        res.redirect('/signin');
    })
    .catch((err)=>{
        res.status(400).send('Error creating user: ' + err);
    });
});


app.get('/',(req, res)=>{
    res.send('hello world, this is working.Good now we can proceed what to do now??')
})

app.get("/signup", (req,res)=>{
    res.render('signup', {title: 'Sign Up - Light Tracker'} )
})

app.get("/signin", (req,res)=>{
    res.render('signin', {title: 'Sign In - Light Tracker'} )
})

app.get("/dashboard", (req,res)=>{
    res.render('dashboard', {title: 'Dashboard - Light Tracker'} )
})




app.listen(port,(err)=>{
    if(err){
        console.log('not active');
        
    }else{
        console.log('active');
        
    }
})