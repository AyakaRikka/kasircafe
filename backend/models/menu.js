'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class menu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  menu.init({
    nama_menu: DataTypes.STRING,
    jenis: DataTypes.ENUM('makanan', 'minuman'),
    harga: DataTypes.DOUBLE,
    deskripsi: DataTypes.TEXT,
    foto: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'menu',
  });
  return menu;
};