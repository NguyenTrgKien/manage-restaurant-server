'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.changeColumn('Orders', 'status', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.changeColumn('Orders', 'status', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  }
};
