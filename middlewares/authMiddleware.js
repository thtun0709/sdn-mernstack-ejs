// Kiểm tra người dùng đã đăng nhập hay chưa
exports.isAuthenticated = (req, res, next) => {
  if (req.session && req.session.member) {
    return next();
  }

  // 👉 Lưu URL hiện tại để quay lại sau khi đăng nhập
  req.session.redirectAfterLogin = req.originalUrl;
  return res.redirect("/login");
};

// Kiểm tra quyền admin
exports.isAdmin = (req, res, next) => {
  const member = req.session.member;
  if (!member || member.role !== "admin") {
    return res.status(403).send("🚫 Bạn không có quyền truy cập!");
  }
  next();
};

// Dùng khi muốn hiển thị khác biệt (VD: header) nếu đã đăng nhập
exports.isLoggedIn = (req, res, next) => {
  res.locals.isLoggedIn = !!req.session.member;
  next();
};
