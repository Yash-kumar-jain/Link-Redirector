const mongoose = require("mongoose");

const userLinkSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required."],
    unique: true,
    trim: true,
    minlength: [1, "Username must be at least 3 characters long."],
    maxlength: [50, "Username cannot be more than 50 characters long."],
  },

  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
},
password: {
    type: String,
    required: [true, "Password is required."],
    minlength: [1, "Password must be at least 8 characters long."],
    select: false,
},

links: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "link"
  },
],


});

module.exports = mongoose.model("userLink", userLinkSchema);
