'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Food', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      dishName: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.DECIMAL(10,3)
      },
      image: {
        type: Sequelize.STRING
      },
      food_outstanding: {
        type: Sequelize.BOOLEAN 
      },
      categoryId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'categories', // Tham chiếu đến bảng category
          key: 'id'
        },
        onDelete: "CASCADE"
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
    await queryInterface.dropTable('Food');
  }
};