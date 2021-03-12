const User = require("../models/user");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

//protected routes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"
  });
  //or same is done by mosh manually
  //function auth(req,res,next){

   //const token=req.header('x-auth-token');
    //if(!token) return res.status(401).send('access denied ..no token..')

    //try{   
    //    const decoded=jwt.verify(token,config.get('jwtPrimaryKey'));//we get payload here
     //   req.user=decoded //storing payload in req.user, using these we can access props of payload
    //    next();    
    //}
    //catch(ex){ //if token doesn't match it throws error
    //    res.status(400).send('invalid token....');
    //}
//}
  
  //custom middlewares

  exports.isAuthenticated = (req, res, next) => {
      //any route we access we send :userid therefore req.profile is populated;
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;  
    if (!checker) {
      return res.status(403).json({
        error: "ACCESS DENIED"
      });
    }
    next();
  };
  
  /*exports.isAdmin = (req, res, next) => {
    if (req.profile.isAdmin) {
        //
    }
    else{
      return res.status(403).json({
        error: "You are not ADMIN, Access denied"
      });
    }
    next();
  };*/