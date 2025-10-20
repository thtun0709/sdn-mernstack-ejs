const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");
const { isLoggedIn } = require("../middlewares/authMiddleware");

console.log("userController.getAllUsers:", typeof userController.getAllUsers);
console.log("userController.getProfile:", typeof userController.getProfile);
console.log("isLoggedIn:", typeof isLoggedIn);

// Danh sách người dùng
router.get("/", isAdmin, userController.getAllUsers);

// Khóa / Mở tài khoản
router.get("/toggle/:id", isAdmin, userController.toggleUserStatus);

// Xóa người dùng
router.get("/delete/:id", isAdmin, userController.deleteUser);

// Trang hồ sơ cá nhân
router.get("/profile",  isAuthenticated, isLoggedIn, userController.getProfile);

// Cập nhật hồ sơ cá nhân
router.post("/profile/update", isAuthenticated, userController.updateProfile);

// Xem hồ sơ của user (dành cho admin)
router.get("/profile/:id", isAdmin, userController.viewUserProfile);

module.exports = router;
