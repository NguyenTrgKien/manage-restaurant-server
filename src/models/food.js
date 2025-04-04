'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Food extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Food.belongsTo(models.Category, {
        foreignKey: "categoryId",
      })
      
      Food.hasMany(models.OrderItem, { // Một món ăn có thể được order nhiều 
        foreignKey: 'foodId',
        onDelete: "CASCADE"
      })

      Food.hasMany(models.Evaluate, {
        foreignKey: 'foodId',
        onDelete: 'CASCADE'
      })
    }
  }
  Food.init({
    dishName: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.DECIMAL(10,3),
    image: DataTypes.STRING,
    food_outstanding: DataTypes.BOOLEAN,
    categoryId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    banner: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Food',
    tableName: 'food',
    timestamps: true
  });
  return Food;
};