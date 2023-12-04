/* eslint-disable */

const db = require("../models");

describe("Todo List Test Suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  test("Should add new todo", async () => {
    const totalCount = await db.Todo.count();
    await db.Todo.addTask({
      title: "Test todo",
      dueDate: new Date(),
      completed: true,
    });
    const newTotalCount = await db.Todo.count();
    expect(newTotalCount).toBe(totalCount + 1);
  });
});

/*const todoList = require("../todo");

const { all, markAsComplete, add, overdue, dueToday, dueLater } = todoList();

describe("Todo list testsuite", () => {
  beforeAll(() => {
    const formattedDate = (d) => {
      return d.toISOString().split("T")[0];
    };

    var dateToday = new Date();
    const today = formattedDate(dateToday);
    const yesterday = formattedDate(
      new Date(new Date().setDate(dateToday.getDate() - 1)),
    );
    const tomorrow = formattedDate(
      new Date(new Date().setDate(dateToday.getDate() + 1)),
    );

    add({ title: "Submit assignment", dueDate: yesterday, completed: false });
    add({ title: "Pay rent", dueDate: today, completed: true });
    add({ title: "Service Vehicle", dueDate: today, completed: false });
    add({ title: "File taxes", dueDate: tomorrow, completed: false });
  });
  test("Should add new todo", () => {
    const formattedDate = (d) => {
      return d.toISOString().split("T")[0];
    };
    var dateToday = new Date();
    const tomorrow = formattedDate(
      new Date(new Date().setDate(dateToday.getDate() + 1)),
    );
    let len = all.length;
    expect(all.length).toBe(len);
    add({ title: "Pay electric bill", dueDate: tomorrow, completed: false });
    expect(all.length).toBe(len + 1);
  });

  test("Should mark as complete", () => {
    expect(all[4].completed).toBe(false);
    markAsComplete(4);
    expect(all[4].completed).toBe(true);
  });

  test("Retrieval of overdue items", () => {
    const overdueList = overdue();
    expect(overdueList.length).toBe(1);
  });

  test("Retrieval of due today items", () => {
    const dueTodayList = dueToday();
    expect(dueTodayList.length).toBe(2);
  });

  test("Retrieval of due later items", () => {
    const dueLaterList = dueLater();
    expect(dueLaterList.length).toBe(2);
  });
});
*/
