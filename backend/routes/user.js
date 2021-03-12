const express = require("express");
const router = express.Router();
const { getUserById,getUser, updateUser}= require("../controllers/user");
const { isSignedIn, isAuthenticated}= require("../middlewares/user");
router.param("userId", getUserById);

router.get("/user/get/:userId", isSignedIn, isAuthenticated, getUser);
router.put("/user/update/:userId", isSignedIn, isAuthenticated, updateUser);

module.exports=router;`             `