const mongoose = require("mongoose");
const WorkspaceModel = require("../models/WorkspaceModel.js");
const UserModel = require("../models/UserModel.js");
exports.getAllWorkspacesByUser = (req, res, next) => {
  const userId = req.userData.userId;
  WorkspaceModel.find({ creator: userId }).then((user) => {
    console.log(typeof user);
    res.json({
      message: "All workspaces fetched successfully",
      workspaces: user,
    });
  });
};
exports.createWorkspaceByUser = (req, res, next) => {
  const userId = req.userData.userId;
  WorkspaceModel.findOne({ creator: userId, name: req.body.name }).then(
    (workspace) => {
      if (workspace === null) {
        const workspace = {
          _id: new mongoose.Types.ObjectId(),
          creator: userId,
          name: req.body.name,
          memCount: 1,
          members: [],
          creationDate: new Date(),
        };
        WorkspaceModel.create(workspace)
          .then((workspace) => {
            UserModel.findByIdAndUpdate(
              userId,
              { $push: { workspaces: workspace._id } },
              { new: true },
            )
              .then(() => {
                res.status(201).json({
                  message: "Workspace created successfully",
                  workspace: workspace,
                });
              })
              .catch((err) => {
                res.status(500).json({
                  error: err,
                });
              });
          })
          .catch((err) => {
            res.status(500).json({
              error: err,
            });
          });
      } else {
        res.status(400).json({
          message: "Workspace with this name already exists",
        });
      }
    },
  );
};
exports.addMemberToWorkspace = (req, res, next) => {
  const userId = req.userData.userId;
  const workspaceId = req.params.workspaceId;
  const memberId = req.body.memberId;
  const date = new Date();
  WorkspaceModel.findOneAndUpdate(
    {
      _id: workspaceId,
      creator: userId,
    },
    {
      $push: {
        members: {
          user_id: memberId,
          permissions: {
            read: req.body.permissions.read,
            write: req.body.permissions.write,
            allowAdd: req.body.permissions.allowAdd,
          },
          addDate: date,
        },
      },
      $inc: { memCount: 1 },
    },
  )
    .then(() => {
      UserModel.findByIdAndUpdate(
        memberId,
        { $push: { workspaces: workspaceId } },
        { new: true },
      )
        .then(() => {
          res.status(200).json({
            message: "Member added to workspace successfully",
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.deleteMemberFromWorkspace = (req, res, next) => {
  const userId = req.userData.userId;
  const workspaceId = req.params.workspaceId;
  const memberId = req.body.memberId;
  WorkspaceModel.findOneAndUpdate(
    {
      _id: workspaceId,
      creator: userId,
    },
    {
      $pull: { members: { user_id: memberId } },
      $inc: { memCount: -1 },
    },
  )
    .then((workspace) => {
      if (!workspace) {
        return res.status(404).json({
          message: "Workspace not found or you are not the creator",
        });
      }
      UserModel.findByIdAndUpdate(
        memberId,
        { $pull: { workspaces: workspaceId } },
        { new: true },
      )
        .then(() => {
          res.status(200).json({
            message: "Member removed from workspace successfully",
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.getWorkspaceById = (req, res, next) => {
  const workspaceId = req.params.workspaceId;
  WorkspaceModel.findById(workspaceId)
    .then((workspace) => {
      if (!workspace) {
        return res.status(404).json({
          message: "Workspace not found",
        });
      }
      res.status(200).json({
        message: "Workspace fetched successfully",
        workspace: workspace,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
