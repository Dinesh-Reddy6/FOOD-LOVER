const mongoose = require('mongoose');
const express = require('express');
const { User} = require('../models/user');

exports.getUserById = (req, res, next, id) => { //route.param() method 
    User.findById(id).exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "No user was found in DB"
        });
      }
      req.profile = user;
      next();
    });
  };

  exports.getUser = (req, res) => {   //before this method route.param() method is excuted which populates req.profile
    req.profile.password = undefined; //exclude this property
    return res.json(req.profile);
  };

  exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(
      { _id: req.profile._id },
      { $set: req.body },
      { new: true, useFindAndModify: false },
      (err, user) => {    //callback is called after updating
        if (err) {
          return res.status(400).json({
            error: "You are not authorized to update this user"
          });
        }
        user.password = undefined;
        res.json(user);
      }
    );
  };
  