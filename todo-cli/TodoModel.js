const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("./connectDB");

class Todo extends Model {
  static async addTask(params) {
    return await Todo.create(params);
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATEONLY,
    },
    completed: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize,
  },
);

module.exports = Todo;

Todo.sync();
