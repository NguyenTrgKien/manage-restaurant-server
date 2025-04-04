'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.changeColumn('Orders', 'status', {
      type: Sequelize.ENUM(
        'PENDING',
        'PAID',
        'CANCELLED',
        'FAILED',
        'PREPARING',
        'READY',
        'WAITPAYMENT',
        'CONFIRM'
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
