'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.hasMany(models.OrderItem, {
        foreignKey: 'orderId',
        onDelete: "CASCADE"
      })
      Order.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: "CASCADE"
      })
      Order.belongsTo(models.OrderTable, {
        foreignKey: 'orderTableId',
        onDelete: "CASCADE"
      })
      Order.hasMany(models.Evaluate, {
        foreignKey: "orderId",
        onDelete: "CASCADE"
      })
    }
  }
  Order.init({
    userId: DataTypes.INTEGER,
    totalAmount: DataTypes.DECIMAL(10, 3),
    paymentMethod: DataTypes.STRING,
    status: DataTypes.ENUM( 'PENDING', 'PAID', 'CANCELLED', 'FAILED', 'PREPARING', 'READY', 'WAITPAYMENT','CONFIRM'),
    orderTableId: DataTypes.INTEGER,
    fullName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};