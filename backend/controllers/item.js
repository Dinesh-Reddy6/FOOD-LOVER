const {Item} = require("../models/Items");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getItemById = (req, res, next, id) => {  //route.param() method
  Item.findById(id)
    .populate("PostedBy")
    .exec((err, item) => {
      if (err) {
        return res.status(400).json({
          error: "Item not found"
        });
      }
      req.item = item;
      next();
    });
};

exports.createItem = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: "problem with image"
      });
    }
    //destructure the fields
    const { name, description, PostedBy } = fields;

    if (!name || !description || !PostedBy) {
      return res.status(400).json({
        error: "Please include all fields"
      });
    }

    let item =new Item(fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!"
        });
      }
      item.photo.data = fs.readFileSync(file.photo.path);
      item.photo.contentType = file.photo.type;
    }
    // console.log(Item);

    //save to the DB
    item.save((err, Item) => {
      if (err) {
        res.status(400).json({
          error: "Saving item in DB failed"
        });
      }
      res.json({item,error:""});
    });
  });
};

exports.getItem = (req, res) => {
  req.item.photo = undefined;
  return res.json(req.item);
};

//middleware to get photo
exports.photo = (req, res, next) => {
  if (req.item.photo.data) {
    res.set("Content-Type", req.item.photo.contentType);
    return res.send(req.item.photo.data);
  }
  next();
};

// delete controllers
exports.deleteItem = (req, res) => {
  let item = req.item;
  item.remove((err, deletedItem) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete the Item"
      });
    }
    res.json({
      error:" ",
      message: "Deletion was a success",
      deletedItem
    });
  });
};


//Item listing

exports.getAllItems = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Item.find()
    .select("-photo")
    .populate("PostedBy")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, items) => {
      if (err) {
        return res.status(400).json({
          error: "NO Item FOUND"
        });
      }
      res.json({items,error:" "});
    });
};


exports.getAllItemsOfUser = (req, res) => {

  Item.find({PostedBy : req.profile._id}) //finding items of particular user only*******
    .select("-photo") 
    .populate("PostedBy")
    .sort()
    .exec((err, items) => {
      if (err) {
        return res.status(400).json({
          error: "NO Item FOUND"
        });
      }
      res.json({items,error:" "});
    });
};