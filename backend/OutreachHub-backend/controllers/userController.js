const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel.js");
require("dotenv").config({ debug: true });

const User = require("../models/UserModel.js");

exports.user_login = (req, res, next) => {
  User.findOne({ "contactInfo.email": req.body.contactInfo.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed",
        });
      } else {
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "Auth failed",
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                email: user.contactInfo.email,
                userId: user._id,
              },
              process.env.JWT_KEY,
              {
                expiresIn: "1h",
              },
            );
            return res.status(200).json({
              message: "Auth successful",
              token: token,
            });
          }
          res.status(401).json({
            message: "Auth failed",
          });
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
exports.user_signup = (req, res, next) => {
  User.findOne({ "contactInfo.email": req.body.contactInfo.email }).then(
    (user) => {
      if (user) {
        return res.status(409).json({
          message: "Email already exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const newUser = {
              _id: new mongoose.Types.ObjectId(),
              name: req.body.name,
              password: hash,
              contactInfo: {
                email: req.body.contactInfo.email,
                phoneNo: req.body.contactInfo.phoneNo,
                countryCode: req.body.contactInfo.countryCode,
              },
              contacts: req.body.contacts || [],
              joinDate: new Date(),
            };
            UserModel.create(newUser)
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: "user created",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    },
  );
};
exports.user_delete = (req, res, next) => {
  UserModel.deleteOne({ _id: req.params.userId })
    .then((result) => {
      res.status(200).json({
        message: "User deleted",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
exports.get_user_by_id = (req, res, next) => {
  UserModel.findById(req.userData.userId, { password: 0 })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      res.status(200).json(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
