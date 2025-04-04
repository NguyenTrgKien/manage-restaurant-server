'use strict';

// Thêm các khóa ngoại giữa các bảng với nhau

module.exports = {
  async up(queryInterface, Sequelize) {
    // Thêm khóa ngoại giữa Orders và OrderTables
    // Thêm khóa ngoại giữa bảng orderTable và bảng timeFrame
    await queryInterface.addConstraint('OrderTables', {
      fields: ['timeFrameId'],
      type: 'foreign key',
      name: 'fk_order_table',
      references: {
        table: 'timeFrames',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    // Xóa khóa ngoại nếu rollback
    await queryInterface.removeConstraint('OrderTables', 'fk_order_table');
  }
};
