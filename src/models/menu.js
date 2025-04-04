'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Dish extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Dish.init({
    dishName: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    image: DataTypes.STRING,
    status: DataTypes.STRING,
    categoryId: DataTypes.INTEGER,
    orderId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Dish',
  });
  return Dish;
};