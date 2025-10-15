exports.sessionData = (req, res, next) => {
    // Truyền thông tin user đang đăng nhập sang tất cả view EJS
    res.locals.member = req.session.member || null;
    next();
  };
  