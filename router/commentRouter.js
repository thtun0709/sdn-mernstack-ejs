const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

// Thêm bình luận
router.post("/:perfumeId", isAuthenticated, commentController.addComment);

// Sửa bình luận
router.post("/edit/:id", isAuthenticated, commentController.editComment);

// Xóa bình luận (chỉ chủ sở hữu hoặc admin)
router.get("/delete/:id", isAuthenticated, commentController.deleteComment);

module.exports = router;
