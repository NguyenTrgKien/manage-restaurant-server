'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn("Evaluates", "orderId", {
      type: Sequelize.INTEGER,
      references: {
        model: 'Orders',
        key: 'id'
      },
      onDelete: "CASCADE"
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn("Evaluates", "orderId");
  }
};
