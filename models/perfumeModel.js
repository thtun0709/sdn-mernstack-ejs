const mongoose = require("mongoose");

const perfumeSchema = new mongoose.Schema(
  {
    // Trường cũ (giữ để tương thích)
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
      default: "/images/default_perfume.jpg", // ảnh mặc định khi chưa có upload
    },
    gender: {
      type: String,
      enum: ["Nam", "Nữ", "Unisex"],
      default: "Unisex",
    },

    // Trường mới theo add.ejs
    perfumeName: { type: String, trim: true },
    uri: { type: String, trim: true },
    concentration: { type: String, enum: ["Extrait", "EDP", "EDT", "Cologne"], default: undefined },
    ingredients: { type: String, trim: true },
    volume: { type: Number, min: 0 },
    targetAudience: { type: String, enum: ["male", "female", "unisex"], default: undefined },

    ratings: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
        stars: {
          type: Number,
          min: 1,
          max: 3,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

// ✅ Optional: format lại giá trị trước khi lưu (đảm bảo đồng nhất)
perfumeSchema.pre("save", function (next) {
  if (this.name) this.name = this.name.trim();
  if (this.brand) this.brand = this.brand.trim();
  if (this.perfumeName) this.perfumeName = this.perfumeName.trim();
  next();
});

perfumeSchema.methods.getAverageRating = function () {
  if (!this.ratings || this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((acc, r) => acc + r.stars, 0);
  return sum / this.ratings.length;
};


module.exports = mongoose.model("Perfume", perfumeSchema);
