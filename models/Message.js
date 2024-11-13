import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true }, // Refers to Chat model
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);
