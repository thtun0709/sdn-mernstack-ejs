const Comment = require("../models/commentModel");

// ➤ Thêm bình luận kèm rating
exports.addComment = async (req, res) => {
  try {
    const { content, rating } = req.body;
    const perfumeId = req.params.id;
    const userId = req.session.member?._id;

    if (!userId) {
      return res.status(401).send("Bạn cần đăng nhập để bình luận");
    }

    // 🔒 Mỗi user chỉ được comment 1 lần mỗi sản phẩm
    const existing = await Comment.findOne({ perfumeId, userId });
    if (existing) {
      return res.redirect(`/perfumes/${perfumeId}?error=already_commented`);
    }

    const newComment = new Comment({ perfumeId, userId, content, rating });
    await newComment.save();

    res.redirect(`/perfumes/${perfumeId}#comments`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi khi gửi bình luận");
  }
};


// ➤ Sửa bình luận
exports.editComment = async (req, res) => {
  try {
    const { content, rating } = req.body;
    const commentId = req.params.id;
    const member = req.session.member;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).send("Không tìm thấy bình luận");

    // chỉ chủ hoặc admin mới được sửa
    if (comment.userId.toString() !== member._id.toString() && member.role !== "admin") {
      return res.status(403).send("Không có quyền chỉnh sửa bình luận này");
    }

    comment.content = content;
    comment.rating = Number(rating) || comment.rating;
    await comment.save();

    res.redirect(`/perfumes/${comment.perfumeId}#comments`);
  } catch (err) {
    console.error("❌ Lỗi khi sửa bình luận:", err);
    res.status(500).send("Lỗi khi chỉnh sửa bình luận");
  }
};

// ➤ Xóa bình luận
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).send("Không tìm thấy bình luận");

    const member = req.session.member;
    const isOwner = member && comment.userId.toString() === member._id.toString();

    if (isOwner || (member && member.role === "admin")) {
      await Comment.findByIdAndDelete(req.params.id);
      res.redirect(`/perfumes/${comment.perfumeId}#comments`);
    } else {
      res.status(403).send("Không có quyền xóa bình luận này");
    }
  } catch (err) {
    console.error("❌ Lỗi khi xóa bình luận:", err);
    res.status(500).send("Lỗi khi xóa bình luận");
  }
};
