# Creating a basic web backend API Part 1

Using Nodejs engine with the express framework, we can create an API that can route requests.
Routing of requests is done by a few parameters

1. Method

- The are a few common http methods.
- The most common are GET, POST, PUT, DELETE
- This are usually define what the request does

2. Path

- The path it takes is which the slash part of the URL
- For example, example.com/api/v1/helloworld
- "/api/v1/helloworld" is the path where every slash is a direction
- So in your application, there can be routes to /api/v2
- or /api/v1/whatsup

After the request is routed, if will call a function in NodeJs.

This is commonly called a controller.

Here, all the logic will run.

So if you want to login, you run all your authentication logic here. If you want to get information about a product, you call the database and recieve the information here.

Before we get into the code, here is some background.
Nodejs uses npm as a package manager.
What a package manager does is literally what its name is. Manage packages. Why? Think of it this way. If you code on your machine using certain packages, I might not have those packages. This will cause me to run into problems when I run your code.

What a package manager does is to store all the packages you use in your code. and when I want to run your code, I just need to ask npm to install all the packages that you are using and then I will be running your application on my computer with all the packages you used for this application

\*\* Package is just a library of code that someone else made usually to make your life easier. Express is such library.

To install a package that gets "tracked" by npm, use the following code.

`npm install {package_name} --save`

This will install the package on your system and also update the package.json file.

If you don't understand then just ignore it for now.

Anyway, I have wrote a simple application on my system. To see the usefulness of the node package manager (npm), follow the following command

```
git clone {this repo}
// navigate into Part1
npm install
npm start
```

Here you have just started a web server.
Go to your browser and type in

```
localhost:8080
```

You should see "Hello World"

If you don't, please raise an issue on github.

## The Code

Lets look into the code.

This code is very simple and is the bare bones of a webserver with literally not much functionality.
But it is sufficient to show what we talked about above

The code is in the file index.js

```
const express = require("express");
const app = express();
```

Here we import the required package, in this case is express. Then we initialize it and assign it to a variable called "app"

Just "trust" if you dont understand.

Below is the important part.

```
app.get("/", function (req, res) {
  res.send("Hello World");
});
```

With the above code, we created an "API" with the "GET" method which sends a "Hello World" text.

Using some pattern recognition, we can see exactly what this code does. I hope.

req and res are request and response respectively. There are parameters that will be passed to the function by the application.
We will use more of this in the next part. But simply put, req is the request parameter is all the information sent by the client to you and response is all the information you are sending back to the client.

To further drive how the point, lets try to write an API with the path "/bye" that sends "bye bye world"

Try first then see below plssss

```
app.get("/bye", function(req, res) {
    res.send("bye bye world");
})
```

Now restart the server by using `control C` then `npm start`

Go back to your browser and go to `localhost:8080/bye`

You should see "bye bye world"

Things to note:
The application reads the paths in order.
For example in the below code, "hell hole world" will be printed instead of "Hello World". It matches the first path is sees and runs that function.

```
app.get("/", function (req, res) {
  res.send("hell hole world");
});

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.get("/bye", function(req, res) {
    res.send("bye bye world");
})
```

## Others

```
var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
```

The above is how the server is started. It is listening on port 8080 and the callback function will be called when it is sucessfully running and print out the string
