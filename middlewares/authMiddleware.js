exports.isAuthenticated = (req, res, next) => {
    if (!req.session.member) return res.redirect("/login");
    next();
  };
  
  exports.isAdmin = (req, res, next) => {
    const member = req.session.member;
    if (!member || member.role !== "admin") {
      return res.status(403).send("Bạn không có quyền truy cập!");
    }
    next();
  };
  
  