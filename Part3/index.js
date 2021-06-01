const express = require("express");
const app = express();

app.use(express.json());

function loginSchemaValidator(req, res, next) {
  const body = req.body;
  if (!body) {
    return res.send("Invalid Body! Body requires keys username and password");
  }
  const username = body.username;
  const password = body.password;

  if (!username || !password) {
    return res.send("Invalid Body! Body requires keys username and password");
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
    return res.send("NOT AUTHORIZED");
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

app.post("/login", loginSchemaValidator, function (req, res) {
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
  let message = "Unauthorized. Incorrect username and password";
  if (isUsernameCorrect && isPasswordCorrect) {
    message = "You have logged in! Welcome John";
  }
  // End processing of username and password
  res.send(message);
});

app.use(decodeMiddleware);

app.post("/bye", function (req, res) {
  const user = req.user;
  res.send("I am " + user.name + " and i like " + user.hobby);
});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
