import dotenv from 'dotenv';
dotenv.config();
import express, { Request, NextFunction, Response, RequestHandler } from 'express';
import cors from 'cors';
import path from 'path';
import { PostModel } from './schemas/post.schema.js';
import { UserModel } from './schemas/user.schema.js'
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { User } from '../shared/models/user.model.js';
import { authHandler } from './middleware/auth.handlers.js';
import cookieParser from 'cookie-parser';

const app = express();
const __dirname = path.resolve();
const PORT = 3501;

app.use(cookieParser());


mongoose.connect('mongodb://localhost:27017/test')
.then(() => {
    console.log('Connected to DB Successfully');
})
.catch(err => console.log('Failed to Connect to DB', err))



app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:4200']
}));
app.use(express.json());

app.get('/', function(req, res) {
   res.json({message:'test'});
});

app.get('/posts', function(req,res){
    PostModel.find()
    .then(data => res.json({data}))
    .catch(err => {
        res.status(501)
        res.json({errors: err});
    })
});

app.get('/users', authHandler, function(req,res){
    UserModel.find()
    .then(data => res.json({data}))
    .catch(err => {
        res.status(501)
        res.json({errors: err});
    })
});
app.post('/create-user', function(req,res){
    const {name, email, username} = req.body;
    const user = new UserModel({
        name,
        username,
        email,
    });
    user.save()
    .then((data) => {
        res.json({data});
    })
    .catch(err => {
        res.status(501);
        res.json({errors: err});
    })
});

app.post('/create-post', function(req,res){
    const {title, body} = req.body;
    const post = new PostModel({
        title,
        body,
    });
    post.save()
    .then((data) => {
        res.json({data});
    })
    .catch(err => {
        res.status(501);
        res.json({errors: err});
    })
});

app.delete('/delete-user/:id', function(req, res) {
    const _id = req.params.id;
    UserModel.findByIdAndDelete(_id).then((data) => {
        console.log(data);
        res.json({data});
    });
})

app.put('/update-user/:id', function(req, res) {
    console.log("Update user");
    UserModel.findByIdAndUpdate(
        req.params.id,
        {
            $set: { name: req.body.name, email: req.body.email },
        },
        {
            new: true,
        },
        function(err, updateUser) {
            if(err) {
                res.send("Error updating user");
            }
            else{
                res.json(updateUser);
            }
        }
    )
});

app.post('/login', function(req, res) {
    UserModel.findOne({ username: req.body.username }, 'username')
    .then(user => {
        if (!user) {
            res.sendStatus(500);
        }
        const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET as string);
        res.cookie('jwt', accessToken, {
            httpOnly: true,
            maxAge: 60 * 1000,
        })
        res.json({message: 'login route', user, accessToken});
    });
});

interface IGetUserAuthInfoRequest extends Request {
    user: User // or any other type
  }
app.get('/logged-in', authHandler, function(req, res) {
    const request = req as IGetUserAuthInfoRequest;
    res.json({authUser: request.user});
} as RequestHandler);
app.get('/logout', authHandler, function(req, res) {
    res.cookie('jwt', '', {
        maxAge: 0,
    });
    res.json({message: 'logout'});
} as RequestHandler);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////']



app.listen(PORT, function(){
    console.log( `starting at localhost http://localhost:${PORT}`);
});



