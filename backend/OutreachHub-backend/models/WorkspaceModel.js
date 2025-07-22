const mongoose = require("mongoose");
const WorkspaceSchema = mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  memCount: { type: Number ,default:1},
  members: [
    {
      user_id: mongoose.Schema.Types.ObjectId,
      permissions: {
        read: { type: Boolean, default: false },
        write: { type: Boolean, default: false },
        allowAdd: { type: Boolean, default: false },
      },
      addDate: { type: Date, default: Date.now },
    },
  ],
  creationDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Workspace", WorkspaceSchema);
