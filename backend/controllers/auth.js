const bcrypt=require('bcrypt');
const {User, validate} = require('../models/user'); 
const mongoose = require('mongoose');
const express = require('express');
const Joi=require("joi");
const jwt=require('jsonwebtoken');   

module.exports.Signup = async (req,res) => {
    const {error}=validate(req.body);
    if(error) return res.status(400).json({error:error.details[0].message});

    const users=await User.findOne({email:req.body.email})
    if(users) return res.status(400).json({error:'user already exists'});

    const user = new User(req.body);

    const salt=await bcrypt.genSalt(5);                          //hashing passwords before svaing to db;
    user.password=await bcrypt.hash(user.password,salt);

  user.save((err, result) => {
    if (err) {
      return res.status(400).json({
        error: "NOT able to save user in DB"
      });
    }
    res.json({
      name: result.name,
      email: result.email,
      id: result._id
    });
  });
}

module.exports.Signin =async (req,res) => {

const {error}=validate_signin(req.body);
 if(error) return res.status(400).json({error:error.details[0].message});

 const user= await User.findOne({email:req.body.email})
 if(!user) return res.status(400).json({error:'no user found'});

 const result=bcrypt.compare(user.password , req.body.password);
 if(!result) return res.status(400).json({error:'incorrect password'}); //if false
//create token
 const token = jwt.sign({_id:user._id,name:user.name,isAdmin:user.isAdmin},process.env.SECRET);
//res.header('x-auth-token',token).send('logged in... token sent in header...' );
  res.cookie("token", token, { expire: new Date() + 9999 });

  //send response to front end
  const { _id, name, email, role } = user;
  return res.json({ token, user: { _id, name, email, role } ,error:" " });    
}

function validate_signin(input){
    const Schema={
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required()
    }
    return Joi.validate(input,Schema)
}

module.exports.Signout = (req, res) => {
    res.clearCookie("token");
    res.json({
      message: "User signout successfully"
    });
  };