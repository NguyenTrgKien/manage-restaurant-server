'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.changeColumn('OrderTables', 'status', {
      type: Sequelize.ENUM(
        'PENDING',
        'CANCELLED',
        'CHECKED_IN',
        'PREPARING',
        'READY',
        'COMPLETED',
        'CONFIRM',
        'NO_SHOW'
      ),
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.changeColumn('OrderTables', 'status', {
      type: Sequelize.ENUM('Đã đặt', 'Đã hủy'),
      allowNull: false,
    });
  }
};
