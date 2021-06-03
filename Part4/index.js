const express = require("express");
const app = express();

app.use(express.json());

function errorFormatter(message, statusCode) {
  const err = new Error(message);
  err.status = statusCode || 500;
  return err;
}

function loginSchemaValidator(req, res, next) {
  const body = req.body;
  if (!body) {
    const message = "Invalid Body! Body requires keys username and password";
    const err = errorFormatter(message, 400); // status code for bad request
    return next(err);
  }
  const username = body.username;
  const password = body.password;

  if (!username || !password) {
    const message = "Invalid Body! Body requires keys username and password";
    const err = errorFormatter(message, 400); // status code for bad request
    return next(err);
  }

  next();
}

function decodeMiddleware(req, res, next) {
  const userIdToInfoMapping = {
    1: {
      name: "johndoe",
      hobby: "nothing",
    },
    2: {
      name: "johnfoe",
      hobby: "manythings",
    },
  };
  const body = req.body;
  const userId = body.userId;

  const user = userIdToInfoMapping[userId];

  if (!user) {
    const message = "Invalid Body! Body requires keys username and password";
    const err = errorFormatter(message, 401);
    return next(err);
  }
  req.user = user;
  next();
}

app.get("/", function (req, res) {
  console.log(req);
  query = req.body;
  console.log(query);
  res.send("Hello World");
});

app.get("/product", function (req, res) {
  const query = req.query;
  console.log(query);
  const name = query.name;
  // process the inforamtion to find information of product with name
  // for simplicity, we will just send the name back
  res.send(name);
});

app.post("/login", loginSchemaValidator, function (req, res, next) {
  const body = req.body;
  console.log(body);
  const username = body.username;
  const password = body.password;

  // Start processing of username and password
  let isUsernameCorrect = false;
  let isPasswordCorrect = false;
  if (username === "johndoe") {
    isUsernameCorrect = true;
  }

  if (password === "pleasedonthackme") {
    isPasswordCorrect = true;
  }
  // START MAIN CHANGE HERE
  let message = "You have logged in! Welcome John";
  if (!isUsernameCorrect || !isPasswordCorrect) {
    message = "Unauthorized. Incorrect username and password";
    err = errorFormatter(message, 401);
    return next(err);
  }
  // END MAIN CHANGE HERE
  // End processing of username and password
  res.send(message);
});

app.use(decodeMiddleware);

app.post("/bye", function (req, res) {
  const user = req.user;
  res.send("I am " + user.name + " and i like " + user.hobby);
});

app.use((req, res, next) => {
  const message = "Route not found";
  const err = errorFormatter(message, 404); // Not found error code
  return next(err);
});

app.use(function (err, req, res, next) {
  const status = err.status || 500;

  console.log(err.message);
  return res.status(status).json({
    status: status,
    message: err.message,
  });
});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
