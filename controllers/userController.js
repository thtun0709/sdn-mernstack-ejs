const Member = require("../models/memberModel");

// ✅ Hiển thị danh sách người dùng (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await Member.find();
    res.render("user/userlist", {
      title: "Quản lý người dùng",
      member: req.session.member,
      users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi khi tải danh sách người dùng");
  }
};

// ✅ Khóa / Mở tài khoản người dùng
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await Member.findById(req.params.id);
    if (!user) return res.status(404).send("Không tìm thấy người dùng");

    user.isActive = !user.isActive; // đảo trạng thái
    await user.save();

    res.redirect("/users");
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi khi cập nhật trạng thái người dùng");
  }
};

// ✅ Xóa người dùng
exports.deleteUser = async (req, res) => {
  try {
    await Member.findByIdAndDelete(req.params.id);
    res.redirect("/users");
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi khi xóa người dùng");
  }
};
