'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class timeFrame extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  timeFrame.init({
    timeFrameName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'timeFrame',
  });
  return timeFrame;
};  