'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Room.init({
    roomName: DataTypes.STRING,
    price: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    roomNumber: DataTypes.INTEGER,
    status: DataTypes.STRING,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Room',
  });
  return Room;
};