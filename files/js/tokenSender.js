//tokenSender.js
const nodemailer = require('nodemailer'); 
const jwt = require('jsonwebtoken'); 

const transporter = nodemailer.createTransport({ 
    service: 'gmail', 
    auth: { 
        user: 'belavtoprostavki@gmail.com',
        pass: 'tmti atua gowr xyix'
    } 
}); 

const token = jwt.sign({ 
        data: 'Token Data'
    }, 'ourSecretKey', { expiresIn: '10m' } 
);   

const mailConfigurations = { 

    // It should be a string of sender/server email 
    from: 'belavtoprostavki@gmail.com', 

    to: 'vseparoli2228@gmail.com', 

    // Subject of Email 
    subject: 'Подтверждение почты', 
    
    // This would be the text of email body 
    text: `Для подтверждения почты просто перейдите по ссылке: http://localhost:3000/verify/${token} `     
}; 

transporter.sendMail(mailConfigurations, function(error, info){ 
    if (error) throw Error(error); 
    console.log('Email Sent Successfully'); 
    console.log(info); 
}); 

