'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Thêm cột "status"
    await queryInterface.addColumn('Tables', 'status', { 
      type: Sequelize.ENUM('Còn trống', 'Đã được đặt', 'Đang sử dụng'),
      allowNull: false,
      defaultValue: 'Còn trống'
    });

    // Thêm cột "location"
    await queryInterface.addColumn('Tables', 'location', { 
      type: Sequelize.ENUM('Tầng 1', 'Tầng 2'),
      allowNull: false,
      defaultValue: 'Tầng 1'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Tables', 'status');
    await queryInterface.removeColumn('Tables', 'location');
  }
};
