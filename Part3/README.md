# Creating a basic web backend API Part 3

## Overview

Now that we have made some simple requests, it is on to the fun stuff. In this section we will be talking about middlewares.

## Main Idea

Express allows you to have middlewares for your requests. Middlewares are something like checkpoints that your request has to get though.

![Middleware Example](./middleware.jpeg)

The middleware function has access to the request and response objects as well.

Why is there a need for this?

Middlewares are commonly used for the following:

1. Pre process the information so that the function can interact with the request better - one common example is `app.use(express.json())` from the previous part.
2. Check if information coming in is of the right format.
3. Check if client is authorized to access the route.

You may think that we can just go to every route and do these things. But this will result in high code duplication. Code duplication is a no go.

There are some middlewares that are route specific and there are others which applies to every route.

### Pre-Req Stuff

Before we go into middlewares, there is another part of the controllers that we have to know about. Other than taking in a request and response, they also take in a parameter called "next". What "next" does when called is that it sends the request and response to the next function to be processed.

So here is how a route will look like with a "next" parameter now.

```
app.get('/', function(req, res, next) {
    res.send('Hello World')
})
```

The next function is very useful for many scenarios. It will make more sense after we use it in middlewares.

### Route specific middleware

\*\*NOTE: These are just names that I made up.

In the previous example, we have a login API. However, we have to trust that the client is giving us the correct body format. If the client does not give us the correct format and decides to mess with us, it might break our systems.

To do this, we have to check the request body before it is sent to the controller. Here we will use a middleware to do it.

```
function loginSchemaValidator(req, res, next) {
    const body = req.body;
    if (!body) {
        return res.send("Invalid Body! Body requires keys username and password")
    }
    const username = body.username;
    const password = body.password;

    if (!username || !password) {
        return res.send("Invalid Body! Body requires keys username and password")
    }

    next()
}
```

Above is a very simple implementation of a validator. You can also use a library like [yup](https://www.npmjs.com/package/yup) that can help you do validations on types as well.

We can see that the middleware function looks just like the controller function. In fact, the controller function can take a next parameter as well for default error handling (more on that later).

To use the middleware, we put it into the route code.

```
app.post('/login', loginSchemaValidator, (req, res){
    ...
})
```

What would happen now if you try to login?

1. The request reaches the server
2. It passes through loginSchemaValidator to check if the request body is valid.
3. If it is valid, it will continue as per normal and run the login logic
4. However, if it is not valid, it will throw an error and end there.

Try it with the following request bodies:

```
{
    "username": "johndoe"
}
```

It should return you "Invalid Body! Body requires keys username and password".

### Global middleware

\*\*NOTE: These are just names that I made up

Middleware can be non route specific as well. It can be used before every request regardless of route, or just access to some routes.

One common example is the `express.json()` code we used previously to help us extract POST request body from the request.

You can write your own middlewares to do other stuff as well. Some examples include protecting routes, decoding certain information for easy access within the routes, etc.

Here we will be doing some "decoding" of information sent and send them on to the routes. In this example, the client sends a request with a body that includes the userId.

```
{
    "userId": 1
}
```

To "decode" it, we do the following:

```
function decodeMiddleware(req, res, next){
    const userIdToInfoMapping = {
        1: {
            "name": "johndoe",
            "hobby": "nothing"
        },
        2: {
            "name": "johnfoe",
            "hobby": "manythings"
        }
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
```

What is happening above?

1. Extracting the userId from the body
2. Looking for the user in the dictionary
3. If the userId is not in the dictionary, we will not allow it to pass
4. Else we assign the user information to req.user and call next()

What is interesting here is that the request is just passed on with a user key included. So any function after this middleware can access this user information by calling `req.user`.

To use this middleware, we add the following code to the section of paths we want to "protect".

```
app.use(decodeMiddleware)
```

In our example code, I placed it before the `/bye` route, changed the method and modified the controller a little to show how we can extract the user information.

Here is the new `/bye` controller.

```
app.post("/bye", function (req, res) {
  const user = req.user;
  res.send("I am " + user.name + " and i like " + user.hobby);
});
```

Try it out on postman and see if you get the desired behavior.

Try the following:

1. No body in request at all //NOT AUTHORIZED
2. Have a body with userId: 1 //I am johndoe and i like nothing
3. Have body with userId: 3 //NOT AUTHORIZED

Now you have learned about middlewares, what else could you do with them?
