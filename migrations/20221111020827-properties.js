'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('properties', 'city', 'kota');
    await queryInterface.renameColumn('properties', 'locality', 'kecamatan');
    await queryInterface.renameColumn('properties', 'sublocality', 'desa');
    await queryInterface.renameColumn('properties', 'kabupaten', 'provinsi');
    await queryInterface.renameColumn('properties', 'postal_code', 'kode_pos');
    await queryInterface.renameColumn('properties', 'brochure', 'brosur');
    await queryInterface.renameColumn('properties', 'categories', 'kategori');
    await queryInterface.renameColumn('properties', 'linked_tender', 'tender_terkait');
    await queryInterface.renameColumn('properties', 'creator', 'kreator');
    await queryInterface.renameColumn('properties', 'description', 'deskripsi');
    await queryInterface.renameColumn('properties', 'developer', 'pengembang');
    await queryInterface.renameColumn('properties', 'fee', 'biaya');
    await queryInterface.renameColumn('properties', 'image_map', 'peta_gambar');
    await queryInterface.renameColumn('properties', 'images', 'gambars');
    await queryInterface.renameColumn('properties', 'index_priority', 'indeks_prioritas');
    await queryInterface.renameColumn('properties', 'is_secondary', 'bekas');
    await queryInterface.renameColumn('properties', 'is_sold', 'terjual');
    await queryInterface.renameColumn('properties', 'premiu', 'premium');
    await queryInterface.renameColumn('properties', 'keywords', 'kata_kunci');
    await queryInterface.renameColumn('properties', 'listing_id', 'id_daftar');
    await queryInterface.renameColumn('properties', 'maps', 'peta');
    await queryInterface.renameColumn('properties', 'name', 'nama');
    await queryInterface.renameColumn('properties', 'near_facilities', 'fasilitas_terdekat');
    await queryInterface.renameColumn('properties', 'panoramas', 'panorama');
    await queryInterface.renameColumn('properties', 'payments', 'pembayaran');
    await queryInterface.renameColumn('properties', 'property_type', 'jenis_properti');
    await queryInterface.renameColumn('properties', 'pengalihan _tender', 'pengalihan_tender');
    await queryInterface.renameColumn('properties', 'rental_price', 'harga_sewa');
    await queryInterface.renameColumn('properties', 'selling_price', 'harga_jual');
    await queryInterface.renameColumn('properties', 'sketch', 'sketsa');
    await queryInterface.renameColumn('properties', 'transaction', 'transaksi');
    await queryInterface.renameColumn('properties', 'spesification', 'spesifikasi');
    await queryInterface.renameColumn('properties', 'type_house', 'jenis_rumah');
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
