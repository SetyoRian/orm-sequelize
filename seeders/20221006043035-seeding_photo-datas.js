'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Photos', [{
      title: 'Foto Jadul',
      caption: 'Waktu itu foto ini diambil di rumah lama bersama keluarga dari ayah',
      image_url: 'https://photojadul.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Foto Keluarga',
      caption: 'Foto bersama istri ketika kita belum menikah',
      image_url: 'https://photokenangan.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Foto Liburan',
      caption: 'Liburan dulu dongss sayyy',
      image_url: 'https://photoliburan.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Foto Malming',
      caption: 'Malam minggu bersama istri dan ibu tercinta',
      image_url: 'https://photokenangan.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
