//app.js
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, get } = require('firebase/database');
const express = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


const app = express();
const PORT = 3000;

const firebaseConfig = {
    apiKey: "AIzaSyBksjnCLyWqL4004kCtrpjzt6mZzl3mk5E",
    authDomain: "avtoprostavki-1337.firebaseapp.com",
    databaseURL: "https://avtoprostavki-1337-default-rtdb.firebaseio.com",
    projectId: "avtoprostavki-1337",
    storageBucket: "avtoprostavki-1337.appspot.com",
    messagingSenderId: "580863358064",
    appId: "1:580863358064:web:133ed9c449a5338601b0b5",
    measurementId: "G-SL7W9G5G4E"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'belavtoprostavki@gmail.com',
        pass: 'tmti atua gowr xyix'
    }
});

app.use(express.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/verify/:token', async (req, res) => {
    const { token } = req.params;

    jwt.verify(token, 'ourSecretKey', async (err, decoded) => {
        if (err) {
            console.log(err);
            res.send("Email verification failed, possibly the link is invalid or expired");
        } else {
            console.log(decoded);

            const email = decoded.email;

            if (!email) {
                console.error("Email is missing in the token");
                return res.status(400).send("Email is missing in the token");
            }

            const userExists = await isUserExists(email);

            if (!userExists) {
                // После подтверждения почты сохраняем пользователя в базе данных
                const userPath = `accounts/${email.replace('.', ',').replace(/\s/g, '')}/`;
                await set(ref(db, userPath), { email, password: decoded.password });

                res.send("Вы успешно подтвердили свою почту и ваша запись добавлена в базу данных Firebase");
            } else {
                res.send("Пользователь с этим email уже подтвержден");
            }
        }
    });
});

app.post('/send-verification-email', async (req, res) => {
    const { email, password } = req.body; // Получаем адрес электронной почты и пароль из запроса

    const token = jwt.sign(
        { email: email, password: password }, // Включаем адрес электронной почты и пароль в токен
        'ourSecretKey',
        { expiresIn: '10m' }
    );

    const mailConfigurations = {
        from: 'belavtoprostavki@gmail.com',
        to: email,
        subject: 'Подтверждение почты',
        text: `Для подтверждения почты просто перейдите по ссылке: 
        https://belavtoprostavki.by/verify/${token}`
        // http://localhost:3000/verify/${token}
    };

    // Отправляем письмо для подтверждения электронной почты
    transporter.sendMail(mailConfigurations, async function(error, info) {
        if (error) {
            console.error('Ошибка при отправке письма:', error);
            res.status(500).send('Ошибка при отправке письма');
        } else {
            console.log('Email Sent Successfully');
            console.log(info);

            res.status(200).send('Письмо с подтверждением отправлено успешно');
        }
    });
});

app.post('/send-order-email-operator', async (req, res) => {
    const { order } = req.body; // Получаем заказ из запроса

    // Преобразуем заказ в JSON строку для включения в письмо
    const orderContent = JSON.stringify(order, null, 2);

    const mailConfigurations = {
        from: 'belavtoprostavki@gmail.com',
        to: 'belavtoprostavki@gmail.com', // Замените на ваш адрес электронной почты
        subject: 'Новый заказ',
        text: `Новый заказ:\n\n${orderContent}`
    };

    // Отправляем письмо с заказом
    transporter.sendMail(mailConfigurations, async function(error, info) {
        if (error) {
            console.error('Ошибка при отправке письма:', error);
            res.status(500).send('Ошибка при отправке письма');
        } else {
            console.log('Email Sent Successfully');
            console.log(info);

            res.status(200).send('Письмо с заказом отправлено успешно');
        }
    });
});


app.post('/send-order-email-user', async (req, res) => {
    const { order, userEmail } = req.body; // Получаем заказ и адрес электронной почты пользователя из запроса

    // Преобразуем заказ в JSON строку для включения в письмо
    const orderContent = JSON.stringify(order, null, 2);

    const mailConfigurations = {
        from: 'belavtoprostavki@gmail.com',
        to: userEmail, // Используем адрес электронной почты пользователя
        subject: 'Ваш заказ успешно оформлен',
        text: `Ваш заказ:\n\n${orderContent}`
    };

    // Отправляем письмо с заказом пользователю
    transporter.sendMail(mailConfigurations, async function(error, info) {
        if (error) {
            console.error('Ошибка при отправке письма:', error);
            res.status(500).send('Ошибка при отправке письма');
        } else {
            console.log('Email Sent Successfully');
            console.log(info);

            res.status(200).send('Письмо с заказом отправлено успешно');
        }
    });
});

    app.post('/send-feedback-email', async (req, res) => {
        const { name, email, phone, comment, method } = req.body; // Получаем заказ и адрес электронной почты пользователя из запроса

        // Преобразуем заказ в JSON строку для включения в письмо
        // const orderContent = JSON.stringify(order, null, 2);

        const mailConfigurations = {
            from: 'belavtoprostavki@gmail.com',
            to: 'belavtoprostavki@gmail.com', 
            subject: 'Была заказана консультация!',
            text: `Информация о пользователе: asdasdsd
            
            \n\n\n\n
            
            Имя:${name}
            Номер:${email}
            Почта:${phone}
            комментарий:${comment}
            Предпочтение:${method}
            `
        };

        // Отправляем письмо с заказом пользователю
        transporter.sendMail(mailConfigurations, async function(error, info) {
            if (error) {
                console.error('Ошибка при отправке письма:', error);
                res.status(500).send('Ошибка при отправке письма');
            } else {
                console.log('Email Sent Successfully');
                console.log(info);

                res.status(200).send('Письмо с заявкой отправлено');
            }
        });
    });

async function isUserExists(email) {
    if (!email) return false;

    const userPath = `accounts/${email.replace('.', ',').replace(/\s/g, '')}/`;
    const userSnapshot = await get(ref(db, userPath));
    return userSnapshot.exists();
}

app.listen(PORT, (error) => {
    if (!error)
        console.log("Server is Successfully Running, and App is listening on port " + PORT);
    else
        console.log("Error occurred, server can't start", error);
});
