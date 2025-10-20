const Perfume = require('../models/perfumeModel');
const Comment = require('../models/commentModel');
const Brand = require('../models/brandModel');

// Hiển thị danh sách nước hoa
exports.getAllPerfumes = async (req, res) => {
  try {
    const perfumes = await Perfume.find();
    res.render('perfumes/list', {
      title: 'Danh sách nước hoa',
      member: req.session.member,
      perfumes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi server');
  }
};

// Hiển thị form thêm nước hoa
exports.showAddForm = async (req, res) => {
  if (!req.session.member || req.session.member.role !== "admin") {
    return res.status(403).send("Truy cập bị từ chối");
  }

  try {
    // ✅ Lấy toàn bộ danh sách brand từ DB (chỉ lấy name, dạng plain object)
    const brands = await Brand.find({}, 'name').lean().sort({ name: 1 });

    res.render('perfumes/add', {   // hoặc 'perfumes/form' nếu anh dùng chung file form
      title: 'Thêm nước hoa',
      member: req.session.member,
      perfume: null,
      error: null,
      brands, // ✅ truyền xuống view
    });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách brand:", err);
    res.status(500).send("Lỗi server khi tải danh sách thương hiệu");
  }
};

// Xử lý thêm mới nước hoa
exports.addPerfume = async (req, res) => {
  if (!req.session.member || req.session.member.role !== "admin") {
    return res.status(403).send("Truy cập bị từ chối");
  }
  try {
    const { name, brand, price, description, gender } = req.body;
    const image = req.file
  ? '/uploads/perfumes/' + req.file.filename
  : '/images/default_perfume.jpg';

    const perfume = new Perfume({
      name,
      brand,
      price,
      description,
      gender,
      image,
    });
    await perfume.save();
    res.redirect('/perfumes');
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi thêm nước hoa');
  }
};

// Hiển thị form chỉnh sửa nước hoa
exports.showEditForm = async (req, res) => {
  if (!req.session.member || req.session.member.role !== "admin") {
    return res.status(403).send("Truy cập bị từ chối");
  }
  try {
    const perfume = await Perfume.findById(req.params.id);
    if (!perfume) return res.status(404).send('Không tìm thấy sản phẩm');
    res.render('perfumes/form', {
      title: 'Chỉnh sửa nước hoa',
      member: req.session.member,
      perfume,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi tải form chỉnh sửa');
  }
};

// Cập nhật nước hoa (không cho đổi brand)
exports.updatePerfume = async (req, res) => {
  if (!req.session.member || req.session.member.role !== "admin") {
    return res.status(403).send("Truy cập bị từ chối");
  }
  try {
    const { name, price, description, gender } = req.body;
    const updateData = { name, price, description, gender };
    if (req.file)
        updateData.image = '/uploads/perfumes/' + req.file.filename;

    await Perfume.findByIdAndUpdate(req.params.id, updateData);
    res.redirect('/perfumes');
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi cập nhật nước hoa');
  }
};

// Xóa nước hoa
exports.deletePerfume = async (req, res) => {
  if (!req.session.member || req.session.member.role !== "admin") {
    return res.status(403).send("Truy cập bị từ chối");
  }
  try {
    await Perfume.findByIdAndDelete(req.params.id);
    res.redirect('/perfumes');
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi xóa nước hoa');
  }
};

// Hiển thị chi tiết nước hoa cho admin và user
exports.getPerfumeDetail = async (req, res) => {
    try {
      const perfume = await Perfume.findById(req.params.id);
      if (!perfume) {
        return res.status(404).send("Không tìm thấy nước hoa");
      }
  
      // ✅ Lấy danh sách comment theo perfumeId
      const comments = await Comment.find({ perfumeId: perfume._id })
        .populate("userId", "name")
        .sort({ createdAt: -1 });
  
      const member = req.session.member;
  
      // Tính trung bình dựa trên comments (ưu tiên), fallback sang ratings của Perfume nếu cần
      const commentRatings = Array.isArray(comments)
        ? comments.map((c) => Number(c.rating) || 0).filter((n) => n > 0)
        : [];
      const ratingsCount = commentRatings.length;
      let avgRating = 0;
      if (ratingsCount > 0) {
        avgRating = commentRatings.reduce((sum, n) => sum + n, 0) / ratingsCount;
      } else if (typeof perfume.getAverageRating === 'function') {
        avgRating = perfume.getAverageRating();
      } else if (Array.isArray(perfume.ratings) && perfume.ratings.length) {
        avgRating = perfume.ratings.reduce((sum, r) => sum + (r.stars || 0), 0) / perfume.ratings.length;
      }

      if (member && member.role === "admin") {
        // 👉 Trang admin xem chi tiết
        res.render("perfumes/perfumeDetail", {
          title: `Chi tiết (Admin) - ${perfume.name}`,
          perfume,
          member,
          comments,
          avgRating,
          ratingsCount,
        });
      } else {
        res.render("perfumes/detail", {
          title: perfume.name,
          perfume,
          member,
          comments,
          avgRating,
          ratingsCount,
          error: req.query.error || null,
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Lỗi khi tải chi tiết nước hoa");
    }
  };

  exports.addRating = async (req, res) => {
    try {
      const { stars } = req.body;
      const perfumeId = req.params.id;
      const userId = req.session.member._id;
  
      if (!stars || stars < 1 || stars > 3) {
        return res.status(400).send("Số sao không hợp lệ (1–3)");
      }
  
      const perfume = await Perfume.findById(perfumeId);
      if (!perfume) return res.status(404).send("Không tìm thấy nước hoa");
  
      // Kiểm tra nếu user đã đánh giá
      const existing = perfume.ratings.find(
        (r) => r.userId.toString() === userId.toString()
      );
  
      if (existing) {
        existing.stars = stars; // cập nhật nếu đã đánh giá
      } else {
        perfume.ratings.push({ userId, stars });
      }
  
      await perfume.save();
      res.redirect(`/perfumes/${perfumeId}`);
    } catch (err) {
      console.error("Lỗi khi đánh giá:", err);
      res.status(500).send("Lỗi server khi đánh giá sản phẩm");
    }
  };
  

  
  