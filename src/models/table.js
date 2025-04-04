'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Table extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Table.hasMany(models.OrderTable, {
        foreignKey: 'tableId',
        onDelete: 'CASCADE'
      })
    }
  }
  Table.init({
    tableName: DataTypes.STRING,
    status: DataTypes.ENUM('Còn trống', 'Đã được đặt', 'Đang sử dụng'),
    location: DataTypes.ENUM('Tầng 1', 'Tầng 2')
  }, {
    sequelize,
    modelName: 'Table',
  });
  return Table;
};