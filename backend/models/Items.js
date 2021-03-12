const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const ItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32
    },
    description: {
      type: String,
      trim: true,
      required: true,
      maxlength: 5000
    },
    PostedBy: {
      type: ObjectId,
      ref: "User",
      required: true
    },
    photo: {
      data: Buffer,
      contentType: String
    }
  },
  { timestamps: true }
);


const validate=(item)=>{
    const Schema={
        name: Joi.string().min(5).max(255).required(),
        description: Joi.string().min(5).max(5000).required(),
        //validate object id in controller
    }
    return Joi.validate(item,Schema)
}

module.exports.Item= mongoose.model("Item", ItemSchema);

module.exports.validate=validate;
