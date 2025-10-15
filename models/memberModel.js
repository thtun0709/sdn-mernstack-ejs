const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const memberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    YOB: { type: Number },
    gender: { type: Boolean }, // true = nam, false = nữ
    role: { type: String, enum: ['member', 'admin'], default: 'member' }, // ✅ chỉ giữ 1
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// 🔒 Mã hoá mật khẩu trước khi lưu
memberSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔑 So sánh mật khẩu khi đăng nhập
memberSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Member", memberSchema);
