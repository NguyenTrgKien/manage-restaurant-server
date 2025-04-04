'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn("OrderTables", "onlyOrderTable", {
      type: Sequelize.BOOLEAN,
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn("OrderTables", "onlyOrderTable");
  }
};
  