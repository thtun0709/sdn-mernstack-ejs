const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Trang đăng ký
router.get("/register", authController.getRegister);
router.post("/register", authController.postRegister);

// Trang đăng nhập
router.get("/login", authController.getLogin);
router.post("/login", authController.login);

// Đăng xuất
router.get("/logout", authController.logout);

module.exports = router;
