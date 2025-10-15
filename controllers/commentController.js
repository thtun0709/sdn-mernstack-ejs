const Comment = require("../models/commentModel");

exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const perfumeId = req.params.id; // ✅ Lấy từ URL (perfumes/:id/comment)
    const userId = req.session.member?._id;

    if (!userId) {
      return res.status(401).send("Bạn cần đăng nhập để bình luận");
    }

    if (!content || !perfumeId) {
      return res.status(400).send("Thiếu nội dung hoặc perfumeId");
    }

    const newComment = new Comment({
      perfumeId,
      userId,
      content,
    });

    await newComment.save();
    res.redirect(`/perfumes/${perfumeId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi khi gửi bình luận");
  }
};

// const existing = await Comment.findOne({ perfumeId, userId });
// if (existing) {
//   return res.status(400).send("Bạn đã bình luận cho sản phẩm này rồi!");
// }
