require('dotenv').config();
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const express = require('express');
const path = require('path');
const mustacheExpress = require('mustache-express');
const PROJECTS = require('./projects');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));


// Configure mustache
app.set('views', `${__dirname}/pages`);
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress());

// Render the template
app.get('/', (req, res) => {
    res.render('index', PROJECTS);
});

// Define a route for the contact page
app.get('/contact', (req, res) => {
    // Send the contact.html file to the client
    res.sendFile(__dirname + '/pages/contact.html');
});

const transporter = nodemailer.createTransport({
    // host: 'mail.gmx.com',
    // port: 465,
    // secure: true,
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD
    }
});

app.post("/contact/send", (req, res) => {
    // console.log('req.body', req.body);
    // res.send('Application Received')
    
    const { name, email, subject, message } = req.body;

    // console.log('New Message', { name, email, subject, message });

    const mailOptions = {
        from: process.env.EMAIL_ID,
        to: process.env.EMAIL_ID,
        subject: `${subject}`,
        html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>message:</strong> ${message}</p>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            // res.status(250).render('/contact_successful.html');
            res.sendFile(__dirname + '/pages/contact_successful.html');
        }
    });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on https://localhost:${port}`)
})