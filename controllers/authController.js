const Member = require("../models/memberModel");
const bcrypt = require("bcryptjs");

function disableCache(res) {
  res.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private, max-age=0"
  );
  res.set("Pragma", "no-cache");
  res.set("Expires", "-1");
}
// [GET] Trang đăng ký
exports.getRegister = (req, res) => {
  if (req.session.member) {
    return res.redirect("/");
  }

  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
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
  if (req.session.member) {
    if (req.session.member.role === "admin") {
      return res.redirect("/perfumes");
    }
    return res.redirect("/");
  }

  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");

  const redirect = req.query.redirect || "/";
  res.render("login", { title: "Đăng nhập", error: null, redirect });
};

// [POST] Xử lý đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password, redirect } = req.body;

    // Nếu có session cũ → xóa trước khi login mới
    if (req.session.member) {
      req.session.destroy();
    }

    // Tìm người dùng
    const member = await Member.findOne({ email });
    if (!member) {
      return res.render("login", {
        error: "Email không tồn tại!",
        title: "Đăng nhập",
        redirect,
      });
    }

    // Kiểm tra trạng thái tài khoản
    if (!member.isActive) {
      return res.render("login", {
        error: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.",
        title: "Đăng nhập",
        redirect,
      });
    }

    // Kiểm tra mật khẩu
    const isMatch = await member.matchPassword(password);
    if (!isMatch) {
      return res.render("login", {
        error: "Sai mật khẩu!",
        title: "Đăng nhập",
        redirect,
      });
    }

    // ✅ Lưu session
    req.session.member = {
      _id: member._id,
      name: member.name,
      email: member.email,
      role: member.role,
    };

    // ✅ Admin → vào quản lý nước hoa
    if (member.role === "admin") {
      return res.redirect("/perfumes");
    }

    // ✅ Member → redirect nếu có, ngược lại về trang chủ
    if (redirect && redirect !== "") {
      return res.redirect(redirect);
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
    res.clearCookie("connect.sid"); // 🧹 Xóa cookie session trên trình duyệt
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.redirect("/login");
  });
};
