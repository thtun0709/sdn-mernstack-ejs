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

// Admin routes

router.get("/",isAdmin, perfumeController.getAllPerfumes);

router.get("/add", isAdmin, perfumeController.showAddForm);
router.post("/add", isAdmin, upload.single("image"), perfumeController.addPerfume);

router.get("/edit/:id", isAdmin, perfumeController.showEditForm);
router.post("/edit/:id", isAdmin, upload.single("image"), perfumeController.updatePerfume);

router.get("/delete/:id", isAdmin, perfumeController.deletePerfume);


// Xem chi tiết nước hoa
router.get("/:id", perfumeController.getPerfumeDetail);

//bình luận
router.post("/:id/comment", isAuthenticated, commentController.addComment);

//rating
router.post("/:id/rate", isAuthenticated, perfumeController.addRating);


router.post("/comment/edit/:id", commentController.editComment);
module.exports = router;
