const mongoose = require("mongoose");
const ContactModel = require("../models/ContactModel.js");
const UserModel = require("../models/UserModel.js");

exports.getAllContactsByUser = (req, res, next) => {
  const userId = req.userData.userId;
  UserModel.findById(userId)
    .populate("contacts")
    .then((user) => {
      console.log(user);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user.contacts);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    });
};
exports.addContactByUser = (req, res, next) => {
  const newContact = {
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    profilePic: req.body.profilePic,
    contactInfo: {
      countryCode: req.body.contactInfo.countryCode,
      phoneNo: req.body.contactInfo.phoneNo,
      email: req.body.contactInfo.email,
    },
    company: req.body.company,
    jobTitle: req.body.jobTitle,
    tags: req.body.tags,
  };
  ContactModel.create(newContact)
    .then((contact) => {
      console.log(contact);
      return UserModel.findByIdAndUpdate(
        req.userData.userId,
        { $push: { contacts: contact._id } },
        { new: true },
      );
    })
    .then(() => {
      res.status(201).json({
        message: "Contact created Successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
