const express = require("express");
var csrf = require("csurf");

const app = express();
const { Todo, User } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");
app.use(bodyParser.json());
var cookieParser = require("cookie-parser");
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("ssh! some secret string"));
app.use(csrf({ cookie: true }));
app.set("view engine", "ejs");

const flash = require("connect-flash");
app.set("views", path.join(__dirname, "views"));
app.use(flash());

const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const saltRounds = 10;
app.use(
  session({
    secret: "my-super-secret-key-54984651846548",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
    resave: true,
    saveUninitialized: true,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (username, password, done) => {
      User.findOne({ where: { email: username } })
        .then(async (user) => {
          const res = await bcrypt.compare(password, user.password);
          if (res) return done(null, user);
          else return done(null, false, { message: "Invalid password" });
        })
        .catch((err) => {
          return err;
        });
    },
  ),
);

passport.serializeUser((user, done) => {
  console.log("Serializing user in session ", user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});

app.get("/", async (request, response) => {
  if (request.user) {
    return response.redirect("/todos");
  }
  response.render("index", {
    title: "Todo Application",
    csrfToken: request.csrfToken(),
  });
});

app.get(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    const allTodos = await Todo.allTodos(request.user.id);
    const errorMsg = request.flash("error");
    if (request.accepts("html")) {
      response.render("todo", {
        allTodos,
        csrfToken: request.csrfToken(),
        errorMsg,
      });
    } else {
      response.json(allTodos);
    }
  },
);

app.use(function (request, response, next) {
  response.locals.messages = request.flash();
  next();
});
app.use(express.static(path.join(__dirname, "public")));

app.get("/login", (req, res) => {
  res.render("login", {
    title: "Login",
    csrfToken: req.csrfToken(),
  });
});

app.post(
  "/session",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    res.redirect("/todos");
  },
);

app.get("/signout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
/*
// app.get(
//   "/todos",
//   connectEnsureLogin.ensureLoggedIn(),
//   async function (request, response) {
//     console.log("Processing list of all Todos ...");
//     try {
//       const todo = await Todo.findAll(request.user.id);
//       return response.json(todo);
//     } catch (error) {
//       console.log(error);
//       return response.status(422).json(error);
//     }
//   },
// );

// app.get(
//   "/todos/:id",
//   connectEnsureLogin.ensureLoggedIn(),
//   async function (request, response) {
//     try {
//       const todo = await Todo.findByPk(request.params.id);
//       return response.json(todo);
//     } catch (error) {
//       console.log(error);
//       return response.status(422).json(error);
//     }
//   },
// );
*/
app.post(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    console.log("title :", request.body.title);
    if (request.body.title.trim() === "") {
      console.log("title :", request.body.title);
      request.flash("error", "Title cannot be empty");
      response.redirect("/todos");
    } else {
      try {
        const todo = await Todo.addTodo({
          title: request.body.title,
          dueDate: request.body.dueDate,
          userId: request.user.id,
        });
        if (request.accepts("html")) {
          return response.redirect("/todos");
        } else {
          // console.log("todo => ", todo.dataValues['completed']);
          return response.json(todo);
        }
      } catch (error) {
        console.log(error);
        return response.status(422).json(error);
      }
    }
  },
);

app.put(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    const todo = await Todo.findByPk(request.params.id);
    try {
      await todo.setCompletionStatus(todo.completed);
      return response.json(todo);
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  },
);

app.get("/signup", async (req, res) => {
  console.log(req.flash("error"));
  res.render("signup", {
    title: "Signup",
    csrfToken: req.csrfToken(),
    flashMessages: await req.flash("error"),
  });
});

app.post("/users", async (req, res) => {
  const res1 = req.body.firstName.trim() === "";
  const res2 = req.body.email.trim() === "";
  const res3 = req.body.password.trim() === "";

  if (res1) {
    req.flash("error", "First name cannot be empty");
    res.redirect("/signup");
  } else if (res2) {
    req.flash("error", "Email cannot be empty");
    res.redirect("/signup");
  } else if (res3) {
    req.flash("error", "Password cannot be empty");
    res.redirect("/signup");
  } else {
    //hash the password
    const hashpass = await bcrypt.hash(req.body.password, saltRounds);
    console.log(hashpass);
    //creating user
    try {
      const user = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashpass,
      });
      req.login(user, (err) => {
        if (err) {
          console.log(err);
        }
        res.redirect("/todos");
      });
    } catch (err) {
      console.log(err);
      req.flash("error", "An error occurred during user creation");
      res.redirect("/signup");
    }
  }
});

app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  try {
    await Todo.remove(request.params.id, request.user.id);
    return response.json({ success: true });
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
  // FILL IN YOUR CODE HERE

  // First, we have to query our database to delete a Todo by ID.
  // Then, we have to respond back with true/false based on whether the Todo was deleted or not.
  // response.send(true)
});

module.exports = app;
