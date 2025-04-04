'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderTable extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrderTable.hasMany(models.Order, {
        foreignKey: 'orderTableId',
        onDelete: "CASCADE"
      })
      OrderTable.belongsTo(models.Table, {
        foreignKey: 'tableId',
        onDelete: 'CASCADE'
      })

      OrderTable.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      })
    }
  }
  OrderTable.init({
    userId: DataTypes.INTEGER,
    tableId: DataTypes.INTEGER,
    orderDate: DataTypes.DATE,
    status: DataTypes.ENUM('Đã đặt', 'Đã hủy'),
    numberGuests: DataTypes.INTEGER,
    timeFrameId: DataTypes.INTEGER,
    messageUser: DataTypes.STRING,
    onlyOrderTable: DataTypes.BOOLEAN
}, {
    sequelize,  
    modelName: 'OrderTable',
  });
  return OrderTable;
};
