const Member = require("../models/memberModel");
const bcrypt = require("bcryptjs");

// [GET] Trang đăng ký
exports.getRegister = (req, res) => {
  res.render("register", { title: "Đăng ký tài khoản", error: null });
};

// [POST] Xử lý đăng ký
exports.postRegister = async (req, res) => {
  const { email, password, name, YOB, gender, role } = req.body; // 👈 thêm role
  try {
    const existing = await Member.findOne({ email });
    if (existing) {
      return res.render("register", {
        title: "Đăng ký tài khoản",
        error: "Email đã tồn tại!",
      });
    }

    // Tạo tài khoản mới
    const newMember = new Member({
      email,
      password,
      name,
      YOB,
      gender,
      role: role || "member", // 👈 mặc định là member nếu không truyền
    });

    await newMember.save();

    // Chuyển hướng sang login
    res.redirect("/login");
  } catch (err) {
    console.error("❌ Lỗi đăng ký:", err);
    res.render("register", {
      title: "Đăng ký tài khoản",
      error: "Lỗi hệ thống, vui lòng thử lại!",
    });
  }
};

// [GET] Trang đăng nhập
exports.getLogin = (req, res) => {
  res.render("login", { title: "Đăng nhập", error: null });
};

// [POST] Xử lý đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm người dùng
    const member = await Member.findOne({ email });
    if (!member) {
      return res.render("login", {
        error: "Email không tồn tại!",
        title: "Đăng nhập",
      });
    }

    // Kiểm tra mật khẩu
    const isMatch = await member.matchPassword(password);
    if (!isMatch) {
      return res.render("login", {
        error: "Sai mật khẩu!",
        title: "Đăng nhập",
      });
    }

    // ✅ Lưu thông tin vào session (quan trọng)
    req.session.member = {
      _id: member._id,
      name: member.name,
      email: member.email,
      role: member.role, // 👈 dòng này cần có để hiển thị CRUD
    };

    // ✅ Redirect theo vai trò
    if (member.role === "admin") {
      res.redirect("/perfumes"); // Admin → trang quản lý nước hoa
    } else {
      res.redirect("/"); // Member → trang chủ
    }
  } catch (err) {
    console.error("❌ Lỗi đăng nhập:", err);
    res.render("login", {
      error: "Đã xảy ra lỗi, vui lòng thử lại!",
      title: "Đăng nhập",
    });
  }
};

// [GET] Đăng xuất
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error("Lỗi khi đăng xuất:", err);
    res.redirect("/login");
  });
};
