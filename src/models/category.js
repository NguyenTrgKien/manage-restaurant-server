'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Định nghĩa quan hệ giữa bảng category và bảng food_type
      Category.hasMany(models.Food, {
        foreignKey: 'categoryId',
        onDelete: "CASCADE" // Nếu xóa danh mục thì tất cả món ăn thuộc danh mục đó sẽ bị xóa
      })
    }
  }
  Category.init({
    categoryName: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
    timestamps: true
  });
  return Category;
};