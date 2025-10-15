const mongoose = require("mongoose");

const perfumeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên nước hoa không được để trống"],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, "Thương hiệu không được để trống"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Giá sản phẩm là bắt buộc"],
      min: [0, "Giá phải lớn hơn hoặc bằng 0"],
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      default: "/images/default_perfume.jpg", // ✅ ảnh mặc định khi chưa có upload
    },
    gender: {
      type: String,
      enum: ["Nam", "Nữ", "Unisex"],
      default: "Unisex",
    },
  },
  { timestamps: true }
);

// ✅ Optional: format lại giá trị trước khi lưu (đảm bảo đồng nhất)
perfumeSchema.pre("save", function (next) {
  if (this.name) this.name = this.name.trim();
  if (this.brand) this.brand = this.brand.trim();
  next();
});

module.exports = mongoose.model("Perfume", perfumeSchema);
