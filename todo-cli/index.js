const { connect } = require("./connectDB");
const Todo = require("./TodoModel");

const createTodo = async () => {
  try {
    await connect();
    const todo = await Todo.addTask({
      title: "First Item",
      dueDate: new Date(),
      completed: false,
    });
    console.log(`created todo with id : ${todo.id}`);
  } catch (error) {
    console.error(error);
  }
};

const countItems = async () => {
  try {
    const totalCount = await Todo.count();
    console.log(`Found ${totalCount} items`);
  } catch (error) {
    console.error(error);
  }
};

const getAllTodo = async () => {
  try {
    const todos = await Todo.findAll();
    const todoList = todos.map((todo) => todo.displayableSting()).join("\n");
    console.log(todoList);
  } catch (error) {
    console.error(error);
  }
};

const updateTodo = async (id) => {
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
};

const deleteTodo = async (id) => {
  try {
    const delItem = await Todo.destroy({
      where: {
        id: id,
      },
    });
    console.log(`delete ${delItem} items`);
  } catch (error) {
    console.error(error);
  }
};
// const singleTodo = async () => {
//     try {
//         const todo = await Todo.findOne({
//             where: {
//                 completed: false
//             },
//             order: [
//                 ['id', 'DESC'],
//             ]
//         });
//         console.log(todo.displayableSting());
//     }
//     catch (error) {
//         console.error(error);
//     }
// }

(async () => {
  await createTodo();
  await countItems();
  await getAllTodo();
  await updateTodo(3);
  await deleteTodo(2);
  await getAllTodo();
})();
