const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require("path");
const database = require('./Middleware/mongoDB');
const expressSession = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(expressSession);

//Controllers
const errorController = require('./Controllers/errorsController');
const accountController = require('./Controllers/accountController');

//Routes
const adminRouter = require('./Routes/admin');
const userRouter = require('./Routes/user');
const accountRouter = require('./Routes/account');

const { isAuthenticated } = require('./Middleware/auth');

//Models
const Post = require('./Models/Post');
const User = require('./Models/User');

//setting view
app.set('view engine', 'ejs');
app.set('views', 'Views');

//json and parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const appListen = async () => {
    try {
        await database.connectToDatabase();

        //session middleware
        app.use(expressSession({
            secret: 'Nassar',
            resave: false,
            saveUninitialized: false,
            store: MongoDBSession({
                uri: "mongodb://localhost:27017/blogDB", collection: 'sessions'
            })
        }));
        //setting routes
        app.use('/admin', isAuthenticated, adminRouter);
        app.use('/user', isAuthenticated, userRouter);
        app.use('/', accountRouter);

        app.use(accountController.getLogin);
        app.use(errorController.get404);

        app.listen(8080);
    } catch (error) {
        console.error('connection failed', error);
    }
}

appListen();
