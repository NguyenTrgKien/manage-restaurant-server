'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
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
        onDelete: "CASCADE"
      },
      totalAmount: {
        type: Sequelize.DECIMAL(10,3)
      },
      paymentMethod: {
        type: Sequelize.STRING
      },
      orderTableId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'OrderTables',
          key: 'id'
        },
        onDelete: "CASCADE"
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'PAID', 'CANCELLED', 'FAILED', 'PROCESSING', 'READY', 'CONFIRMED')
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
    await queryInterface.dropTable('Orders');
  }
};