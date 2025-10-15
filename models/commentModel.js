const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    perfumeId: { type: mongoose.Schema.Types.ObjectId, ref: "Perfume", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },
    content: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
