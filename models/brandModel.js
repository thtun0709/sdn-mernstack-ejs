const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên thương hiệu không được để trống"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
      default: "/images/default_brand.png",
    },
    country: {
      type: String,
      trim: true,
    },
    foundedYear: {
      type: Number,
      min: [1800, "Năm thành lập phải từ 1800 trở lên"],
      max: [new Date().getFullYear(), "Năm thành lập không được vượt quá năm hiện tại"],
    },
    website: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Format lại giá trị trước khi lưu
brandSchema.pre("save", function (next) {
  if (this.name) this.name = this.name.trim();
  if (this.description) this.description = this.description.trim();
  if (this.country) this.country = this.country.trim();
  if (this.website) this.website = this.website.trim();
  next();
});

module.exports = mongoose.model("Brand", brandSchema);
