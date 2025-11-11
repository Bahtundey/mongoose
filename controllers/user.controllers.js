const bcrypt = require('bcryptjs');
const saltRounds = 10;
// const session = require('express-session');
const nodemailer = require('nodemailer');
const User = require('../models/user.models');
const port = process.env.PORT || 3600;


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
            res.redirect('/user/signin');
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
                    res.redirect('/user/dashboard');
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




module.exports = {
    getHomePage,
    getSignup,
    getSignin,
    getDashboard,
    postSignup,
    postSignin
}