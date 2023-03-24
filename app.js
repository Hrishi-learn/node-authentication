const express = require('express');
const mongoose=require('mongoose');
const router=require('./routes/authRoutes');
const cookieParser = require('cookie-parser');

const app=express();

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

app.set('view engine','ejs');

const dbURI="mongodb+srv://hrishi:holla@cluster0.1qommtn.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(dbURI,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(()=> console.log("db started"))
.catch((err)=>console.log(err));

app.listen(3000);

app.get('/',(req,res)=>{
    res.render('home');
});
app.get('/smoothies',(req,res)=>{
    res.render('smoothies');
});
app.get('/cookies-get',(req,res)=>{
    res.cookie('newuser','mgmgm',{httpOnly:true});
    res.send('cookie was send to you');
});
app.get('/read-cookies',(req,res)=>{
    const cookies=req.cookies;
    console.log(cookies);
    res.json({name:"hrsi"});
});
app.use(router);