/* eslint-disable */
const request = require("supertest");
const cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");

let server, agent;
function extractToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}
describe("Todo Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });

  test("Creates a todo and responds with json at /todos POST endpoint", async () => {
    const res = await agent.get("/");
    const csrfToken = extractToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    console.log(response);
    expect(response.statusCode).toBe(302);
  });

  test("Marks a todo with the given ID as complete", async () => {
    const res = await agent.get("/");
    const csrfToken = extractToken(res);
    const todoID = 1;
    const response = await agent
      .put(`/todos/${todoID}`)
      .set("Accept", "application/json")
      .send({ _csrf: csrfToken });
    expect(JSON.parse(response.text).completed).toBe(true);
  });

  test("Marks a todo with the given ID as incomplete", async () => {
    const res = await agent.get("/");
    const csrfToken = extractToken(res);
    const todoID = 1;
    const response = await agent
      .put(`/todos/${todoID}`)
      .set("Accept", "application/json")
      .send({ _csrf: csrfToken });
    expect(JSON.parse(response.text).completed).toBe(false);
  });

  test("Fetches all todos in the database using /todos endpoint", async () => {
    const res = await agent.get("/");
    const csrfToken = extractToken(res);
    await agent.post("/todos").send({
      title: "Buy xbox",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    await agent.post("/todos").send({
      title: "Buy ps3",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    const response = await agent.get("/todos");
    const parsedResponse = JSON.parse(response.text);

    expect(parsedResponse.length).toBe(3);
    expect(parsedResponse[2]["title"]).toBe("Buy ps3");
  });

  test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {
    const res1 = await agent.get("/");
    const csrfToken = extractToken(res1);
    const todoID = 1;
    const res = await agent
      .delete(`/todos/${todoID}`)
      .send({ _csrf: csrfToken });
    expect(JSON.parse(res.text).success).toBe(true);
  });
});
