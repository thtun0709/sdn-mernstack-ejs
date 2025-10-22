const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { isAuthenticated } = require("../middlewares/authMiddleware");
const Comment = require("../models/commentModel");

// Thêm bình luận
router.post("/:perfumeId", isAuthenticated, commentController.addComment);

// Sửa bình luận
router.post("/edit/:id", isAuthenticated, commentController.editComment);

// ✅ Xóa comment (cho phép admin hoặc chính chủ)
router.get("/delete/:id", async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.id);
      if (!comment) return res.status(404).send("Không tìm thấy bình luận");
  
      const member = req.session.member;
      if (!member) return res.redirect("/login");
  
      // ✅ Cho phép xóa nếu là admin hoặc chính chủ
      if (member.role !== "admin" && comment.userId.toString() !== member._id.toString()) {
        return res.status(403).send("Bạn không có quyền xóa bình luận này");
      }
  
      // Lưu lại perfumeId trước khi xóa
      const perfumeId = comment.perfumeId;
  
      // Thực hiện xóa comment
      await comment.deleteOne();
  
      // ✅ Quay lại đúng trang tương ứng
      // Nếu admin đang ở trang /perfumes/detail => quay lại đó
      // Nếu ở trang quản trị (perfumeDetail) => quay lại đó
      if (member.role === "admin") {
        return res.redirect(`/perfumes/${perfumeId}?from=home`);
      } else {
        return res.redirect(`/perfumes/${perfumeId}`);
      }
    } catch (err) {
      console.error("❌ Lỗi khi xóa bình luận:", err);
      res.status(500).send("Lỗi khi xóa bình luận");
    }
  });
  

module.exports = router;
