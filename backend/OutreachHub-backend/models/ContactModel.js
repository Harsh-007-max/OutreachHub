const mongoose = require("mongoose");
const ContactSchema= mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name:{type:String,required:true},
  profilePicture: {type:String,default:"https://www.w3schools.com/howto/img_avatar.png"},
  contactInfo: {
    countryCode:{type:String},
    phoneNo: { type: Number, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match:
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
  },
  company:{type:String,required:true},
  jobTitle:{type:String,required:true},
  tags:{type:[mongoose.Schema.Types.ObjectId],ref:'Tag'},
});

module.exports = mongoose.model("Contact", ContactSchema);
