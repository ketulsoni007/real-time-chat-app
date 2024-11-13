import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  isGroupChat: { type: Boolean, default: false },
  groupName: {
    type: String,
    required: function () { return this.isGroupChat; },
    unique: function () { return this.isGroupChat; },
  },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  groupAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: function () { return this.isGroupChat; },
  },
  latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
}, { timestamps: true });

export default mongoose.model("Chat", chatSchema);
