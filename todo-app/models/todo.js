"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    static allTodos() {
      return this.findAll();
    }
    static async addTodo({ title, dueDate }) {
      return await this.create({
        title: title,
        dueDate: dueDate,
        completed: false,
      });
    }

    static async remove(id) {
      return this.destroy({
        where: {
          id,
        },
      });
    }
    async setCompletionStatus(res) {
      await this.update({ completed: !res });
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    },
  );
  return Todo;
};
