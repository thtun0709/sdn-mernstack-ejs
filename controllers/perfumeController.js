const Perfume = require('../models/perfumeModel');
const Comment = require('../models/commentModel');

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
exports.showAddForm = (req, res) => {
  res.render('perfumes/form', {
    title: 'Thêm nước hoa',
    member: req.session.member,
    perfume: null,
  });
};

// Xử lý thêm mới nước hoa
exports.addPerfume = async (req, res) => {
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

// Cập nhật nước hoa
exports.updatePerfume = async (req, res) => {
  try {
    const { name, brand, price, description, gender } = req.body;
    const updateData = { name, brand, price, description, gender };
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
  try {
    await Perfume.findByIdAndDelete(req.params.id);
    res.redirect('/perfumes');
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi xóa nước hoa');
  }
};

//xem chi tiết nước hoa 
// Hiển thị chi tiết nước hoa cho admin
// Hiển thị chi tiết nước hoa cho admin và user
exports.getPerfumeDetail = async (req, res) => {
    try {
      const perfume = await Perfume.findById(req.params.id);
      if (!perfume) {
        return res.status(404).send("Không tìm thấy nước hoa");
      }
  
      // ✅ Lấy danh sách comment theo perfumeId
      const comments = await Comment.find({ perfumeId: perfume._id })
        .populate("userId", "name") // lấy tên người bình luận
        .sort({ createdAt: -1 });
  
      const member = req.session.member;
  
      if (member && member.role === "admin") {
        // 👉 Trang admin xem chi tiết
        res.render("perfumes/perfumeDetail", {
          title: `Chi tiết (Admin) - ${perfume.name}`,
          perfume,
          member,
          comments, // ✅ thêm dòng này
        });
      } else {
        // 👉 Trang người dùng xem chi tiết
        res.render("perfumes/detail", {
          title: perfume.name,
          perfume,
          member,
          comments, // ✅ thêm dòng này
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Lỗi khi tải chi tiết nước hoa");
    }
  };
  