'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Evaluate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Evaluate.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      })
      Evaluate.belongsTo(models.Food, {
        foreignKey: 'foodId',
        onDelete: 'CASCADE'
      })

      Evaluate.belongsTo(models.Order, {
        foreignKey: "orderId",
        onDelete: "CASCADE"
      })
    }
  }
  Evaluate.init({
    foodId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    comment: DataTypes.TEXT,
    scoreEvaluate: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Evaluate',
  });
  return Evaluate;
};