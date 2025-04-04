'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderItems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orderId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Orders',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      foodId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Food',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      price: {
        type: Sequelize.DECIMAL(10, 3)
      },
      quantityOrder: {
        type: Sequelize.INTEGER
      },
      totalPrice: {
        type: Sequelize.DECIMAL(10, 3)
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
    await queryInterface.dropTable('OrderItems');
  }
};