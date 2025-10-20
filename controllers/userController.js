const Member = require("../models/memberModel");
const bcrypt = require("bcryptjs");

//Hiển thị danh sách người dùng (Admin)
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

// Khóa / Mở tài khoản người dùng
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

// Xóa người dùng
exports.deleteUser = async (req, res) => {
  try {
    await Member.findByIdAndDelete(req.params.id);
    res.redirect("/users");
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi khi xóa người dùng");
  }
};


// User - Trang hồ sơ cá nhân
exports.getProfile = async (req, res) => {
  try {
    const sessionMember = req.session.member;
    if (!sessionMember || !sessionMember._id) {
      console.warn("⚠️ Chưa có session.member");
      return res.redirect("/login");
    }

    const user = await Member.findById(sessionMember._id);
    if (!user) return res.redirect("/login");

    res.render("user/profile", {
      title: "Hồ sơ cá nhân",
      member: sessionMember, 
      user, 
    });
  } catch (err) {
    console.error("❌ Lỗi khi lấy thông tin user:", err);
    res.redirect("/");
  }
};

// User - Cập nhật hồ sơ cá nhân
exports.updateProfile = async (req, res) => {
  try {
    const sessionMember = req.session.member;
    if (!sessionMember) return res.redirect("/login");

    const { name, email, password } = req.body;
    const updatedData = { name, email };

    if (password && password.trim() !== "") {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await Member.findByIdAndUpdate(
      sessionMember._id,
      updatedData,
      { new: true }
    );

    // Cập nhật lại session để đồng bộ hiển thị
    req.session.member.name = updatedUser.name;
    req.session.member.email = updatedUser.email;

    res.redirect("/users/profile");
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật hồ sơ:", err);
    res.redirect("/users/profile");
  }
};

exports.viewUserProfile = async (req, res) => {
  try {
    const user = await Member.findById(req.params.id);
    if (!user) {
      return res.status(404).send("Không tìm thấy người dùng");
    }

    res.render("admin/userProfile", {
      title: `Hồ sơ người dùng - ${user.name}`,
      user,
    });
  } catch (err) {
    console.error("❌ Lỗi khi xem hồ sơ người dùng:", err);
    res.status(500).send("Lỗi hệ thống");
  }
};
