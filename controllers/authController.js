const User = require('../models/User');
const jsonwebtoken=require('jsonwebtoken');
module.exports.signup_get = (req,res)=>{res.render("signup")};
module.exports.login_get = (req,res)=>{res.render("login")};
const maxAge=3*24*60*60;

const createToken = (id)=>{
    const jwt = jsonwebtoken.sign({id},"mysecretkey",{
        expiresIn:maxAge,
    })
    return jwt;
}

const handleErrors = (e)=>{
    let errors = {email:'',password:''};
    if(e.code==11000){
        errors.email='email already in use';
        return errors;
    }
    if(e.message.includes("email doesnot exists")){
        errors.email="email doesnot exists";
        return errors;
    }
    if(e.message.includes("incorrect password")){
        errors.password="incorrect password";
        return errors;
    }
    if(e.message.includes('user validation failed')){
        Object.values(e.errors).forEach((err)=>{
            errors[err.properties.path]=err.properties.message;
        })
        return errors;
    }
};
module.exports.signup_post=async(req,res)=>{
    const {email,password}=req.body;
    try{
        const user = await User.create({email,password});
        const token=createToken(user._id);
        res.cookie("jwt",token,{httpOnly:true,maxAge:maxAge*1000,})
        res.status(201).json({user:user._id});
    }catch(e){
        const errors=handleErrors(e);
        res.status(400).json({errors})
    }
};
module.exports.login_post = async (req,res)=>{
    const {email,password} = req.body;
    try{
        const user = await User.login(email,password);
        const token=createToken(user._id);
        res.cookie("jwt",token,{httpOnly:true,maxAge:maxAge*1000});
        res.status(200).json({user:user._id});
    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
};