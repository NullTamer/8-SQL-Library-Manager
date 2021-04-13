"use strict";

const Sequelize = require("sequelize");

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Book.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "Name is required.",
          },
        },
      },
      author: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "Author is required.",
          },
        },
      },
      genre: { type: Sequelize.STRING },
      year: { type: Sequelize.INTEGER },
    },
    {
      sequelize,
      modelName: "Book",
    }
  );
  return Book;
};
