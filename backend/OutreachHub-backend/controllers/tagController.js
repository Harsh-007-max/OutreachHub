const mongoose = require("mongoose");
const TagModel = require("../models/TagsModel.js");
const auth = require("../middlewares/auth.js");
exports.getAllTags = (req, res) => {
  TagModel.find()
    .then((tags) => {
      res.status(200).json({
        message: "All tags fetched successfully",
        tags: tags,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
exports.createTag = (req, res) => {
  const newTag = {
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
  };

  TagModel.create(newTag)
    .then((tag) => {
      res.status(201).json({
        message: "Tag created successfully",
        tag: tag,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
//protect delete route
exports.deleteTag = (req, res) => {
  const tagId = req.params.tagId;

  TagModel.findByIdAndDelete(tagId)
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          message: "Tag not found",
        });
      }
      res.status(200).json({
        message: "Tag deleted successfully",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.updateTag = (req, res) => {
  const tagId = req.params.tagId;
  const updatedData = {
    name: req.body.name,
  };

  TagModel.findByIdAndUpdate(tagId, updatedData, { new: true })
    .then((tag) => {
      if (!tag) {
        return res.status(404).json({
          message: "Tag not found",
        });
      }
      res.status(200).json({
        message: "Tag updated successfully",
        tag: tag,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.getTagById = (req, res) => {
  const tagId = req.params.tagId;

  TagModel.findById(tagId)
    .then((tag) => {
      if (!tag) {
        return res.status(404).json({
          message: "Tag not found",
        });
      }
      res.status(200).json({
        message: "Tag fetched successfully",
        tag: tag,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
