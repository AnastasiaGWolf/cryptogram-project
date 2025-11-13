'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QuoteTranslation extends Model {
    static associate(models) {
      QuoteTranslation.belongsTo(models.Quote, { foreignKey: 'quote_id' });
    }
  }
  QuoteTranslation.init({
    quote_id: DataTypes.INTEGER,
    language: DataTypes.STRING,
    text: DataTypes.TEXT,
    cipher: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'QuoteTranslation',
  });
  return QuoteTranslation;
};