// require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const myOAuth2Client = new OAuth2(
    "801066871700-f72p99o6h2oosmct177nrbfvb2scnjks.apps.googleusercontent.com",
    "2mb4z7c0C7w-6GokeIaB5-jZ",
)

myOAuth2Client.setCredentials({
    refresh_token: "1//04G-wYQ08EhtGCgYIARAAGAQSNwF-L9IrSXTC8Jg59eXS1GXDg4pgZbJlPgc6-Bc8CwOZ8fIDn1GcwU6ASLuKuQ72X1byq5QpWSA"
});


const myAccessToken = myOAuth2Client.getAccessToken()


const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: "flencorporation@gmail.com", //your gmail account you used to set the project up in google cloud console"
        clientId: myOAuth2Client._clientId,
        clientSecret: myOAuth2Client._clientSecret,
        refreshToken: "1//04G-wYQ08EhtGCgYIARAAGAQSNwF-L9IrSXTC8Jg59eXS1GXDg4pgZbJlPgc6-Bc8CwOZ8fIDn1GcwU6ASLuKuQ72X1byq5QpWSA",
        accessToken: myAccessToken //access token variable we defined earlier
    }
});

app.post('/api/form', (req, res) => {


    const htmlEmail = `
    <h3>Contact Details</h3>
    <ul>
        <li>Name: ${req.body.name}</li>
        <li>Email: ${req.body.email}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
    `;

    const mailOption = {
        from: '"Flen Mailer 📧" <flencorporation@gmail.com>', // sender address
        to: "flencorporation@gmail.com", // list of receivers
        subject: "Test NodeMailer working ✔", // Subject line
        text: req.body.message, // plain text body
        html: htmlEmail, // html body
    };

    transport.sendMail(mailOption, (err, info) => {
        if (err) {
            res.send({
                message: err
            })
        } else {
            console.log('Email sent');
            transport.close();
            res.send({
                message: 'Email has been sent: check your inbox!'
            })
        }
    })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})