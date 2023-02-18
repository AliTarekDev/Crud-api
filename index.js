const express= require('express');
const app= express();
const cors= require('cors');
const bodyParser= require('body-parser');
const { dbConnection } = require('./src/database/dbConnection');
const postModel= require('./src/components/posts/post.api');
const userModel= require('./src/components/users/user.api');

const AppError  = require('./src/utils/appError');
const globalErrorMiddleware = require('./src/utils/globalErrorMiddleware');
require('dotenv').config({path: './config/.env'})

app.use(cors());
app.use(bodyParser.json())


//routes
app.use("/post", postModel);
app.use('/user', userModel);
app.use('/public/images', express.static(__dirname+ '/public/images'));

//handle unhandled routes
app.all('*', (req,res,next)=> {
    next(new AppError(`can't find this route: ${req.originalUrl} on this site`, 404))
});

//Global Error
app.use(globalErrorMiddleware)
dbConnection();
app.listen(process.env.PORT, ()=> {
    console.log("listened to port", process.env.PORT);
})