'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      OrderItem.belongsTo(models.Order, {
        foreignKey: "orderId",
        onDelete: 'CASCADE'
      })
      OrderItem.belongsTo(models.Food, { // Một chi tiết món ăn chỉ thuộc về một món ăn
        foreignKey: 'foodId',
        onDelete: "CASCADE"
      })
    }
  }
  OrderItem.init({
    orderId: DataTypes.INTEGER,
    foodId: DataTypes.INTEGER,
    quantityOrder: DataTypes.INTEGER,
    totalPrice: DataTypes.DECIMAL(10, 3),
    price: DataTypes.DECIMAL(10, 3),
  }, {
    sequelize,
    modelName: 'OrderItem',
  });
  return OrderItem;
};
