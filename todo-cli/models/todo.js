"use strict";
const { Op } = require("sequelize");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addTask(params) {
      return await Todo.create(params);
    }
    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      // FILL IN HERE
      let todos = await this.overdue();
      let todoList = todos.map((todo) => todo.displayableString()).join("\n");
      console.log(todoList);
      console.log("\n");

      console.log("Due Today");
      // FILL IN HERE
      todos = await this.dueToday();
      todoList = todos.map((todo) => todo.displayableString()).join("\n");
      console.log(todoList);
      console.log("\n");

      console.log("Due Later");
      // FILL IN HERE
      todos = await this.dueLater();
      todoList = todos.map((todo) => todo.displayableString()).join("\n");
      console.log(todoList);
    }

    static async overdue() {
      // FILL IN HERE TO RETURN OVERDUE ITEMS
      try {
        const overdueList = await Todo.findAll({
          where: {
            dueDate: { [Op.lt]: new Date(new Date().toDateString()) },
          },
        });
        return overdueList;
      } catch (error) {
        console.error(error);
      }
    }

    static async dueToday() {
      // FILL IN HERE TO RETURN ITEMS DUE tODAY
      try {
        const dueTodayList = await Todo.findAll({
          where: {
            dueDate: { [Op.eq]: new Date(new Date().toDateString()) },
          },
        });
        return dueTodayList;
      } catch (error) {
        console.error(error);
      }
    }

    static async dueLater() {
      // FILL IN HERE TO RETURN ITEMS DUE LATER
      try {
        const dueLaterList = await Todo.findAll({
          where: {
            dueDate: { [Op.gt]: new Date(new Date().toDateString()) },
          },
        });
        return dueLaterList;
      } catch (error) {
        console.error(error);
      }
    }

    static async markAsComplete(id) {
      // FILL IN HERE TO MARK AN ITEM AS COMPLETE
      try {
        await Todo.update(
          { completed: true },
          {
            where: {
              id: id,
            },
          },
        );
      } catch (error) {
        console.error(error);
      }
    }

    displayableString() {
      const formattedDate = (d) => {
        return d.toISOString().split("T")[0];
      };
      let checkbox = this.completed ? "[x]" : "[ ]";
      return `${this.id}. ${checkbox} ${this.title} ${
        new Date(this.dueDate).getTime() ==
        new Date(formattedDate(new Date())).getTime()
          ? ""
          : this.dueDate
      }`;
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
