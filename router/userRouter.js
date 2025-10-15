const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { isAdmin } = require("../middlewares/authMiddleware");

console.log("userController.getAllUsers:", typeof userController.getAllUsers);

// Danh sách người dùng
router.get("/", isAdmin, userController.getAllUsers);

// Khóa / Mở tài khoản
router.get("/toggle/:id", isAdmin, userController.toggleUserStatus);

// Xóa người dùng
router.get("/delete/:id", isAdmin, userController.deleteUser);

module.exports = router;
