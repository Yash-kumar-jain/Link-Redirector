const mongoose = require("mongoose");

const linkSchema = mongoose.Schema({
    originalLink: {
    type:String,
    validate: {
        validator: function(v) {
            return /^https?:\/\/.+$/.test(v); // Basic URL validation
        },
        message: "Invalid URL format!"
    },
    required: [true, "link is required."],
    trim: true,

},

    redirectedLink : {
    type:String,
    trim: true,

},
user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userLink',              
},
addName:{
    type:Boolean,
    default:false,
}


});

module.exports = mongoose.model("link", linkSchema);
