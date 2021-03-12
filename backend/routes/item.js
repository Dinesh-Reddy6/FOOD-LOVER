const express = require("express");
const router = express.Router();

const {
  getItemById,
  createItem,
  getItem,
  photo,
  deleteItem,
  getAllItems,
  getAllItemsOfUser,
} = require("../controllers/item");
const { isSignedIn, isAuthenticated, isAdmin } = require("../middlewares/user");
const { getUserById } = require("../controllers/user");

//all of params
router.param("userId", getUserById);
router.param("ItemId", getItemById);

//all of actual routes
//create route
router.post(
  "/Item/create/:userId",
  isSignedIn,
  isAuthenticated,
  createItem
);

// read or get routes to get a particular item and its photo
router.get("/Item/:ItemId", getItem);
router.get("/Item/photo/:ItemId", photo);

//delete route to delete particular item
router.delete(
  "/Item/:ItemId/:userId",
  isSignedIn,
  isAuthenticated,
  deleteItem
);


//listing all items
router.get("/Items", getAllItems);

//listing items of particular user
router.get("/Items/:userId",getAllItemsOfUser);

module.exports = router;
