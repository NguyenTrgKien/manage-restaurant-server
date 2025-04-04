'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderTables', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      tableId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Tables',
          key: 'id'
        },
        onDelete: "CASCADE"
      },
      orderDate: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.ENUM('Đã đặt', 'Đã hủy')
      },
      numberGuests: {
        type: Sequelize.INTEGER
      },
      timeFrameId: {
        type: Sequelize.INTEGER
      },
      messageUser: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('OrderTables');
  }
};