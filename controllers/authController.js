const Member = require("../models/memberModel");
const bcrypt = require("bcryptjs");

// [GET] Trang đăng ký
exports.getRegister = (req, res) => {
  res.render("register", { title: "Đăng ký tài khoản", error: null });
};

// [POST] Xử lý đăng ký
exports.postRegister = async (req, res) => {
  const { email, password, name, YOB, gender, role } = req.body;
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
      role: role || "member", 
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
  const redirect = req.query.redirect || "/";
  res.render("login", { title: "Đăng nhập", error: null, redirect });
};

// [POST] Xử lý đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password, redirect } = req.body;

    const member = await Member.findOne({ email });
    if (!member) {
      return res.render("login", {
        error: "Email không tồn tại!",
        title: "Đăng nhập",
        redirect,
      });
    }

    const isMatch = await member.matchPassword(password);
    if (!isMatch) {
      return res.render("login", {
        error: "Sai mật khẩu!",
        title: "Đăng nhập",
        redirect,
      });
    }

    req.session.member = {
      _id: member._id,
      name: member.name,
      email: member.email,
      role: member.role,
    };

    // ✅ Nếu có redirect thì quay lại URL cũ
    if (redirect && redirect !== "") {
      return res.redirect(redirect);
    }

    // ✅ Nếu không có redirect, về trang phù hợp
    if (member.role === "admin") {
      return res.redirect("/perfumes");
    } else {
      return res.redirect("/");
    }
  } catch (err) {
    console.error("❌ Lỗi đăng nhập:", err);
    res.render("login", {
      error: "Đã xảy ra lỗi, vui lòng thử lại!",
      title: "Đăng nhập",
      redirect: req.body.redirect || "/",
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
