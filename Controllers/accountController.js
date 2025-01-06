const database = require("../Middleware/mongoDB");
ObjectId = require('mongodb').ObjectId;
const user = require('../Models/User');
const { validationResult } = require('express-validator');

let LoggedUser;

exports.getLoggedUser = () => {
    return LoggedUser;
}

exports.getLogin = (req, res, next) => {
    if (req.session && req.session.isAuthenticated) {
        return res.redirect(`/user/blog?firstName=${LoggedUser}`);
    }
    res.render('account/login', { title: 'Login', failed: false });
}

exports.getRegister = (req, res, next) => {
    res.render("account/register", { title: "Register", failed: false, errors: [] })
}

exports.login = async (req, res, next) => {
    const db = await database.getDb();
    const users = db.collection('users');

    const userName = req.body.userName;
    const password = req.body.password;

    const user = await users.findOne({ userName: userName, password: password });
    if (user) {
        req.session.isAuthenticated = true;
        await users.updateOne({ _id: user._id }, { $set: { isActive: true } })
        LoggedUser = userName;
        res.redirect(`/user/blog?firstName=${encodeURIComponent(user.firstName)}`);
    }
    else {
        res.render("account/login", { title: "LOGIN", failed: true })
    }


}

exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array())
        res.render('account/register', {
            failed: true, title: "Register",
            errors: errors.array().map(error => error.msg),
        })
    }
    else {
        const db = await database.getDb();
        const users = db.collection('users');

        const userName = req.body.userName;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const dateOfBirth = req.body.dateOfBirth;
        const country = req.body.country;
        const city = req.body.city;
        const password = req.body.password;

        if (await users.findOne({ userName: userName }) || await users.findOne({ email: email })) {
            res.render('account/register', { failed: true, title: "Register", errors: ["User Already Exists"] })
        }
        else {
            const newUser = new user({
                firstName: firstName,
                lastName: lastName,
                email: email,
                roles: ["user"],
                isActive: true,
                dateOfBirth: dateOfBirth,
                address: {
                    country: country,
                    city: city
                },
                userName: userName,
                password: password,
            })
            const result = await users.insertOne(newUser);
            if (result) {
                req.session.isAuthenticated = true;
                LoggedUser = userName;
                res.redirect(`/user/blog?firstName=${encodeURIComponent(firstName)}`);
            }
            else {
                res.render('account/register', { failed: true, title: "Register", errors: ["Registration failed, please try again later"] })
            }
        }
    }
}
