const Brand = require('../models/brandModel');

// Hiển thị danh sách thương hiệu
exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ name: 1 });
    res.render('brands/list', {
      title: 'Danh sách thương hiệu',
      member: req.session.member,
      brands,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi server');
  }
};

// Hiển thị form thêm thương hiệu
exports.showAddForm = (req, res) => {
  if (!req.session.member || req.session.member.role !== "admin") {
    return res.status(403).send("Truy cập bị từ chối");
  }
  res.render('brands/form', {
    title: 'Thêm thương hiệu',
    member: req.session.member,
    brand: null,
  });
};

// Xử lý thêm mới thương hiệu
exports.addBrand = async (req, res) => {
  if (!req.session.member || req.session.member.role !== "admin") {
    return res.status(403).send("Truy cập bị từ chối");
  }
  try {
    const { name, description, country, foundedYear, website } = req.body;

    const brand = new Brand({
      name,
      description,
      country,
      foundedYear: foundedYear ? parseInt(foundedYear) : undefined,
      website,
    });
    await brand.save();
    res.redirect('/brands');
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi thêm thương hiệu');
  }
};

// Hiển thị form chỉnh sửa thương hiệu
exports.showEditForm = async (req, res) => {
  if (!req.session.member || req.session.member.role !== "admin") {
    return res.status(403).send("Truy cập bị từ chối");
  }
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).send('Không tìm thấy thương hiệu');
    res.render('brands/form', {
      title: 'Chỉnh sửa thương hiệu',
      member: req.session.member,
      brand,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi tải form chỉnh sửa');
  }
};

// Cập nhật thương hiệu
exports.updateBrand = async (req, res) => {
  if (!req.session.member || req.session.member.role !== "admin") {
    return res.status(403).send("Truy cập bị từ chối");
  }
  try {
    const { name, description, country, foundedYear, website } = req.body;
    const updateData = { 
      name, 
      description, 
      country, 
      foundedYear: foundedYear ? parseInt(foundedYear) : undefined,
      website 
    };

    await Brand.findByIdAndUpdate(req.params.id, updateData);
    res.redirect('/brands');
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi cập nhật thương hiệu');
  }
};

// Xóa thương hiệu
exports.deleteBrand = async (req, res) => {
  if (!req.session.member || req.session.member.role !== "admin") {
    return res.status(403).send("Truy cập bị từ chối");
  }
  try {
    await Brand.findByIdAndDelete(req.params.id);
    res.redirect('/brands');
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi xóa thương hiệu');
  }
};

// Hiển thị chi tiết thương hiệu
exports.getBrandDetail = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).send("Không tìm thấy thương hiệu");
    }

    res.render("brands/detail", {
      title: brand.name,
      brand,
      member: req.session.member,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi khi tải chi tiết thương hiệu");
  }
};
