const express = require("express");
const router = express.Router();
const perfumeController = require("../controllers/perfumeController");
const commentController = require("../controllers/commentController");
const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// Debug (chỉ dùng dev)
console.log("isAdmin:", typeof isAdmin);
console.log("upload:", typeof upload);
console.log("addPerfume:", typeof perfumeController.addPerfume);

// ------------------------
// 🔹 Admin routes
// ------------------------
router.get("/", perfumeController.getAllPerfumes);

router.get("/add", isAdmin, perfumeController.showAddForm);
router.post("/add", isAdmin, upload.single("image"), perfumeController.addPerfume);

router.get("/edit/:id", isAdmin, perfumeController.showEditForm);
router.post("/edit/:id", isAdmin, upload.single("image"), perfumeController.updatePerfume);

router.get("/delete/:id", isAdmin, perfumeController.deletePerfume);

// ------------------------
// 🔹 User & Public routes
// ------------------------

// Xem chi tiết nước hoa
router.get("/:id", perfumeController.getPerfumeDetail);

// Thêm bình luận
router.post("/:id/comment", isAuthenticated, commentController.addComment);

module.exports = router;
