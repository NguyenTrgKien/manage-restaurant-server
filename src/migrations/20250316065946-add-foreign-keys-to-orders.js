'use strict';

// Thêm các khóa ngoại giữa các bảng với nhau

module.exports = {
  async up(queryInterface, Sequelize) {
    // Thêm khóa ngoại giữa Orders và OrderTables
    await queryInterface.addConstraint('Orders', {
      fields: ['orderTableId'],
      type: 'foreign key',
      name: 'fk_order_table',
      references: {
        table: 'OrderTables',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

  },

  async down(queryInterface, Sequelize) {
    // Xóa khóa ngoại nếu rollback
    await queryInterface.removeConstraint('Orders', 'fk_order_table');
  }
};
