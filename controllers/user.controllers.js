const bcrypt = require('bcryptjs');
const saltRounds = 10;
const nodemailer = require('nodemailer');
const User = require('../models/user.models');
const port = process.env.PORT || 3600;
const jwt = require('jsonwebtoken');


const getHomePage = (req, res) => {
    res.send('hello world, this is working. Good now we can proceed!');
}

const getSignup = (req, res) => {
    res.render('signup', { title: 'Sign Up - Light Tracker' });
}

const postSignup = (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    const strongPasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!strongPasswordRegex.test(password)) {
        return res.status(400).send(
            "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit"
        );
    }

    User.findOne({ email })
        .then((existingUser) => {
            if (existingUser) {
                res.status(400).send('Email already exists');
                return Promise.reject('user already exists');
            }
            return bcrypt.hash(password, saltRounds);
        })
        .then((hashedPassword) => {
            if (!hashedPassword) return;
            const newUser = new User({
                firstname,
                lastname,
                email,
                password: hashedPassword,

            });
            console.log(newUser);
            return newUser.save();
        })
        .then((savedUser) => {
            if (!savedUser) return;
            console.log('User registered successfully');

            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'bahtundey0044@gmail.com',
                    pass: 'asgwaxaqerizcsrr'
                }
            })
            let mailOptions = {
                from: 'bahtundey0044@gmail.com',
                to: [req.body.email],
                subject: 'Welcome to our routerlication',
                html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h1 style="color: #4CAF50;">Welcome to Light Tracker!</h1>
              <p>Hi <strong>${firstname} ${lastname}</strong>,</p>
              <p>Thank you for signing up for our routerlication. We are thrilled to have you on board!</p>
              <p>Here are some quick links to get you started:</p>
              <ul>
                <li><a href="http://localhost:${port}/signin" style="color: #4CAF50; text-decoration: none;">Sign In</a></li>
                <li><a href="http://localhost:${port}/dashboard" style="color: #4CAF50; text-decoration: none;">Visit Dashboard</a></li>
              </ul>
              <p>If you have any questions, feel free to reply to this email. We're here to help!</p>
              <p>Best regards,</p>
              <p>The Light Tracker Team</p>
              <footer style="margin-top: 20px; font-size: 12px; color: #777;">
                <p>You are receiving this email because you signed up for Light Tracker.</p>
                <p>&copy; 2025 Light Tracker. All rights reserved.</p>
              </footer>
            </div>
          `
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent:' + info.response)
                }
            });
            // res.redirect('/user/signin');
            res.status(201).json({success: true, message:'Sign up successful'});
        })
        .catch((err) => {
            if (err !== 'user already exists') {
                console.log('Error saving user:', err);
                res.status(500).send('Internal server error');
            }
        });
}

const getSignin = (req, res) => {
    res.render('signin', { title: 'Sign In - Light Tracker' });
}
const postSignin = (req, res) => {
    const { email, password } = req.body;


    User.findOne({ email })
        .then((user) => {
            if (!user) {
                return res.status(400).send('Invalid email or password');
            }


            return bcrypt.compare(password, user.password)
                .then((isMatch) => {
                    if (!isMatch) {
                        return res.status(400).send('Invalid email or password');
                    }

                    req.session.user = {
                        firstname: user.firstname,
                        lastname: user.lastname,
                        email: user.email
                    };

                    console.log('User logged in successfully', user.firstname, user.lastname);
                    // res.redirect('/user/dashboard');

                    res.status(200).json({ success: true, message: 'Signin successful'})
                    const token = jwt.sign({id: user._id, email: user.email}, process.env.JWT_SECRET, {expiresIn: '1h'});  
                    console.log(token)

                    res.status(200).json({ success: true, message: 'Signin successful', token, user: req.session.user });
                
        });
        })
        .catch((err) => {
            console.log('Login error:', err);
            res.status(500).send('Internal server error');
        });
}
const getDashboard = (req, res) => {
    const user = req.session.user;
    if (!user) {

        return res.redirect('/user/signin');
    }
    res.render('dashboard', {
        title: 'Dashboard - Light Tracker',
        firstname: user.firstname,
        lastname: user.lastname
    });
}


const musicAPI = [
    {id: 1, songTitle: 'gokada', songUrl: 'https://open.spotify.com/track/2aQcVp8NHhCOhgZh76k1Ui?si=9ff6ee72ff844442', songImg: 'https://share.google/images/ji3rbj8wJB7wl54Az', songArtist: 'Fola'},
    {id: 2, songTitle: 'you', songUrl: 'https://open.spotify.com/track/6RW5AtwRPRc4C0j2EgCdTr?si=1b339696a2ba4735', songImg: 'https://share.google/images/8CQZJHqWohUO5exZX', songArtist: 'Fola'},
    {id: 3, songTitle: 'lost', songUrl: 'https://open.spotify.com/track/2aQcVp8NHhCOhgZh76k1Ui?si=9ff6ee72ff844442', songImg: 'https://share.google/images/OuLndmp4v73EfEFcQ', songArtist: 'Fola,Kizz Daniel'},
    {id: 4, songTitle: 'healer', songUrl: 'https://open.spotify.com/track/7q6EdEhPwkVfu4XGgP4kXV?si=bbc3017774e64e70', songImg: 'https://share.google/images/bjAO24A9kJ6M8TLTo', songArtist: 'Fola'},
    {id: 5, songTitle: 'Guts Over Fear', songUrl: 'https://open.spotify.com/track/0VZs2OQq4axr8GFRdC9nyD?si=b0eaf268c0ca45ae', songImg: 'https://share.google/images/KR2pKeg21XdxPq7Pp', songArtist: 'Eminem, Sia'},
    {id: 6, songTitle: 'No LOve', songUrl: 'https://open.spotify.com/track/3h6WizK7Qtac8KdyfjaUTR?si=142587b209c24852', songImg: 'https://share.google/images/EOio8BMS8Y8MyJKw8', songArtist: 'Eminem, Lil Wayne'},
    {id: 7, songTitle: 'Be With You', songUrl: 'https://open.spotify.com/track/5fFVy5lNikE6Gls8qKLS5L?si=16c4e3d20884472f', songImg: 'https://share.google/images/IOOxNdERNmWpxAq12', songArtist: 'Akon'},
    {id: 8, songTitle: 'Birthmark', songUrl: 'https://open.spotify.com/track/3XJDtvp6AvCsuqyHCTMeo8?si=af76b06f93754b52', songImg: 'https://share.google/images/jUkeGxAkvxnKR3y10', songArtist: 'Akon'},
    {id: 9, songTitle: 'Bag Blood', songUrl: 'https://open.spotify.com/track/6xsEAm6w9oMQYYg3jkEkMT?si=e7595df3759c4db0', songImg: 'https://share.google/images/7TIDoweacuWYRkYQJ', songArtist: 'Taylor Swift, Kendrick Lamar'},
    {id: 10, songTitle: 'Miss My Dogs', songUrl: 'https://open.spotify.com/track/3G6aAx6mbI8QXVHtICvWSg?si=f83638273f3646d5', songImg: 'https://share.google/images/cKi0bsHdKbzg3iw9H', songArtist: 'Young Thug'},
    {id: 11, songTitle: 'California Breeze', songUrl: 'https://open.spotify.com/track/6ug9fUi5oLLgQgOF1G8WkM?si=3f647393fa4a4bbb', songImg: 'https://share.google/images/8zBFxtvSkDDz73jt7', songArtist: 'Lil Baby'},
    {id: 12, songTitle: 'wgft', songUrl: 'https://open.spotify.com/track/0WsC4ETIXyiHDMXRaPMvKe?si=dd0a3a35e41b4095', songImg: 'https://share.google/images/DmKv8zOzDymJQHrzW', songArtist: 'Gunna, Burna Boy'},
    {id: 13, songTitle: '28 Grams', songUrl: 'https://open.spotify.com/track/5XHZWCpKc4XJghIYi8uHgi?si=75be2345f51747cd', songImg: 'https://share.google/images/mTJuFLx0aI6F5hh10', songArtist: 'Burna Boy'},
    {id: 14, songTitle: 'Aduni', songUrl: 'https://open.spotify.com/track/07oWoYAboy2uZhDb0EMvge?si=83f0f215d8964fb6', songImg: 'hhttps://share.google/images/ghNmslFwJwWAZ3v3n', songArtist: 'Rybeena'},
    {id: 15, songTitle: 'Tony Montola', songUrl: 'https://open.spotify.com/track/7wnsInSkMr5dwK2snGfT4R?si=182a1c5618a0490a', songImg: 'https://share.google/images/JSnkZu7wtzlaDipoU', songArtist: 'Young John'}
]

const getMusicAPI = (req, res) => {
    res.json(musicAPI);
}

let allStudents = [
    {name: "felix", age: 50, accountBalance: 20000, course: 'software engineer'},
    {name: "dayo", age: 50, accountBalance: 50000, course: 'survey engineer'},
    {name: "deji", age: 50, accountBalance: 20000, course: 'data analyst'},
    {name: "tunji", age: 50, accountBalance: 20000, course: 'devop'},
    {name: "tunde", age: 50, accountBalance: 20000, course: 'graphics designer'},
    {name: "sele", age: 50, accountBalance: 20000, course: 'ai'},
    {name: "bayo", age: 50, accountBalance: 20000, course: 'cyber security'},
]

const getAllStudents = (req, res) => {
    res.json(allStudents);
}


module.exports = {
    getHomePage,
    getSignup,
    getSignin,
    getDashboard,
    postSignup,
    postSignin,
    getMusicAPI,
    getAllStudents
}