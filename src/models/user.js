'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Staff, {
        foreignKey: 'userId',
        onDelete: "CASCADE"
      })
      User.hasMany(models.Order, {
        foreignKey: 'userId',
        onDelete: "CASCADE"
      })

      User.hasMany(models.OrderTable, {
        foreignKey: 'userId',
        onDelete: "CASCADE"
      })

      User.hasOne(models.Cart, {
        foreignKey: 'userId',
        onDelete: "CASCADE"
      })

      User.hasOne(models.Customer, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      })

      User.hasOne(models.Evaluate, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      })
    }
  }
  User.init({
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    image: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};