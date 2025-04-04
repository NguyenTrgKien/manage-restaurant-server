'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.changeColumn('Orders', 'status', {
      type: Sequelize.ENUM(
        'PENDING', // Chờ xác nhận
        'PAID', // Đã thanh toán
        'CANCELLED', // Đã hủy
        'FAILED', // Đã hủy
        'PREPARING', // Đang chuẩn bị
        'READY', // Đã sãn sàng
        'WAITPAYMENT', // Chờ thanh toán
        'CONFIRM', // Đã xác nhận 
        'NO_SHOW', // Khách không đến
        'COMPLETED', // Đã hoàn thành
        'CHECKED_IN' // Khách đã đến
      ),
      allowNull: false,
      defaultValue: 'PENDING',
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.changeColumn('Orders', 'status', {
      type: Sequelize.ENUM('PENDING', 'PAID', 'CANCELLED', 'FAILED'),
      allowNull: false,
      defaultValue: 'PENDING',
    });
  }
};
