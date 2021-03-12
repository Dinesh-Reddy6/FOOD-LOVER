const express = require("express");
const router = express.Router();
const {Signin,Signup,Signout}= require("../controllers/auth");

router.post("/signin",Signin);
router.get("/signout",Signout);
router.post("/signup",Signup);

module.exports= router;