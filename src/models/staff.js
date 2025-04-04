'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Staff.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: "CASCADE"
      })
      Staff.belongsTo(models.Position, {
        foreignKey: 'positionId',
      })
      Staff.belongsTo(models.Status, {
        foreignKey: 'statusId',
      })
    }
  }
  Staff.init({
    userId: DataTypes.INTEGER,
    address: DataTypes.STRING,
    gender: DataTypes.STRING,
    startDate: DataTypes.DATEONLY,
    positionId: DataTypes.INTEGER,
    salary: DataTypes.DECIMAL(11,0),
    statusId: DataTypes.INTEGER,
    phoneNumber: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Staff',
  });
  return Staff;
};