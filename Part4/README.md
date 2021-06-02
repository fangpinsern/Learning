# Creating a basic web backend API Part 4

## Overview

As our code base gets bigger, we need a better way to handle errors. For example, now if a request sent does not meet the requirement, you use `res.send` to send a message. However, doing that in every single function is time intensive and a lot of code duplication!

For example, if some one says to change the error message tomorrow to a JSON format instead, you will be plucking your hairs changing every line.

So before we expand our code further, we will try to handle errors in a more elegant way.

### Side track

If you try an undefined route like `/whotttt` in the code from part3, you will get "NOT AUTHORIZED". Why is this happening? Because the code is read like a script and it has passed all defined routes and none match. When it hits the "decodeMiddleware" middleware, it runs a check on the body since it is empty, it will respond as "NOT AUTHORIZED".

If you insert a valid body like `{"userId":1}`, it will allow you to pass and you will get something like "Cannot GET /whotttt". This is not nice and may possibly break things.

To stop this from happening, we have an "umbrella" middleware to catch all routes that are not matched.

```
app.use((req, res, next) => {
  return res.send("Route not found");
});
```

Back to error handling

## Motivation

What we want is a middleware that will handle all errors. This lets us consolidate all error handling code into one section.

Luckily, the express package provides us with this functionality.

## Main Idea

Express has a special middleware for error handling. This middleware takes in 4 parameters instead of the usual 3. It looks something like this:

```
app.use(function (err, req, res, next) {
  const status = err.status || 500;

  console.log(err.message);
  return res.status(status).json({
    status: status,
    message: err.message,
  });
});
```

What are we doing here?

1. err is passing into the middleware as a function.
2. From the err parameter, we extract the status. If there is no status, we will use 500 as a default
3. We log the error message
4. A response is sent back to the client with status and a json message attached to it.

\*\*NOTE: This is one of the many response function that are available in the response object. For more details, you can have a look at the documentation [here](http://expressjs.com/en/api.html#res).

With this special error handling middleware, how do we use it?

We use it by adding an argument to the `next()` call that we always use. This is the same next call that is in all middlewares and controllers but we always leave the parameters empty.

Hence, if we insert a parameter, express will know this is an error and the request will be routed to the error handling middleware.

To show an example, I will use the login route from the previous part. Below is the updated login code.

```
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
    err = new Error(message);
    err.status = 401;
    return next(err);
  }
  // END MAIN CHANGE HERE
  // End processing of username and password
  res.send(message);
});
```

Zoom in on main change part:

```
// START MAIN CHANGE HERE
let message = "You have logged in! Welcome John";
if (!isUsernameCorrect || !isPasswordCorrect) {
    message = "Unauthorized. Incorrect username and password";
    err = new Error(message);
    err.status = 401;
    return next(err);
}
// END MAIN CHANGE HERE
```

Whats happening here:

1. if username or password incorrect, enter if block
2. creation of new error object with message provided
3. added a status code to the error object (FYI: 401 is the default "UNAUTHORIZED" status code. More details about other codes can be found [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status))
4. call the error handling middleware

COPY OF ERROR MIDDLEWARE

```
app.use(function (err, req, res, next) {
  const status = err.status || 500;

  console.log(err.message);
  return res.status(status).json({
    status: status,
    message: err.message,
  });
});
```

5. When the error is passed here, status is extracted from the error object and error message is logged
6. A response is sent to the client.

Similar to the normal req and response parameters, the err parameter in the error handling middleware also passes the message and status onwards.

We can include this in all our other middlewares as well! So instead of `res.send("something")`, we can create an error object and call next(err)

This is just the basic of error handling. However, if you need to change the way error responses are sent to the client, we just have to change 1 function.

Try out changing all the errors.

\*\*NOTE: What is meant by errors are things that disrupts the intended flow of the request. For example, incorrect body format is an error, unauthorized login is also an error. It does not have to be be server breaking errors only.

## Extra stuff

If you try to do the changing of error handling talked about above, you will probably be copy and pasting alot of the following line.

```
message = "Unauthorized. Incorrect username and password";
err = new Error(message);
err.status = 401;
return next(err);
```

So much code duplication! So what we can do here is abstract the creation of error out and make it a function. The function also attaches the status code to the error. Here is an example of the function:

```
function errorFormatter(message, statusCode) {
  const err = new Error(message);
  err.status = statusCode || 500;
  return err;
}
```

What is happening here?

1. Create new error object with message passed as parameter
2. attach status code if defined. Else default is 500
3. return the error object created.

So now instead of whats above, we can change it to:

```
message = "Unauthorized. Incorrect username and password";
err = errorFormatter(message, 401)
return next(err);
```

"Reduce by 1 line only???" - Someone

Though we only reduce it by 1 line, we have given ourselves the opportunity to change how errors are formatted. Also, if you use it 1000 times, you will be saving 1000 lines of code(loc)
