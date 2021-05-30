# Creating a basic web backend API Part 2

After knowing the bare bones of the application, we move on to more exciting things. In order for an API to be useful, there needs to be some information exchange between the client and the server.

This information is done through the request and response parameters. From the previous part, we see the request and response in the function.

## Pre-Req Info

Before we move on, we have to first understand more about what each request does.

In simple words (maybe abit too simple):

1. GET - As the name suggest, gets information from the server
2. POST - Send information from the client to the server for further processing. (e.g. create user, login user, etc)
3. PUT/PATCH - Update existing information
4. DELETE - As the name suggest, delete information.

More details about the requests here: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods

For now, we are only interested in GET and POST requests.

### GET Request

In GET requests, it is common to send information about the thing you want to get through the URL.

For example,

```
/GET
localhost:8080/hello?name=john
```

To break this link down:

- Domain - `locahost:8080`
- Path - `/hello`
- Query - `?name=john`

You can even chain queries up with '&'.

For example,

```
localhost:8080/hello?firstname=john&lastname=doe
```

### POST Request

In POST Request however, it is common to send information in the body of the request. That is a seperate section that is not in the URL. To see this, please download [Postman](https://www.postman.com/downloads/)

Usually, the information will be sent in the body in a json format.

For example:

```
POST /login
body
{
    "firstname": "john",
    "lastname": "doe"
}
```

Here, the domain and path MAY be the same as above but the request type is not.

## Main Info

After a basic understanding of what each request does, we have get the information sent by the client.

Putting the following code in any of the GET functions will show you

```
console.log(req)
```

You will see a long list of things in your console. These are all information you can extract from the request.

### GET Reqeust

Here, we are going to return information about a product with the name "ball"

What we want the url to be is something like the following:

```
GET
localhost:8080/product/?name=ball
```

Remember that the path is `/product` and the query is `?name=ball`.

```
app.get('/product', function(req, res){
    const query = req.query;
    console.log(query);
    const name = query.name;
    // process the inforamtion to find information of product with name
    // for simplicity, we will just send the name back
    res.send(name);
})
```

Whats happening here?

1. req.query gives a json object that has the parameters in the query.

```
Query: ?name=ball
req.query: {
    "name": "ball"
}

Query: ?name=ball&size=1
req.query: {
    "name": "ball",
    "size": "1" //note that this is a string not an int
}
```

2. We console log the query just for you to see that the query returns
3. Extract the name from the json object
4. Process the input to get required information (nothing is done here though)
5. Send a response

This is mostly what is needed to send a get request.

### POST Request

As mentioned in the pre-req, post request usually sends information in the body. We will be using the JSON format here.

To extract information out of request body, we need this thing called middlewares. We will go into more detail about middlewares in the next part. But for now, just think of it as part of flow a request takes

path a request takes

```
client -> server -> middleware -> function -> response
```

We use the following code to parse the request payload into json format. This allows us to easily interact with the request body and extract information.

```
app.use(express.json());
```

What we will be doing here is logging in a user by checking if their username and passwords are correct.

Here is what we want the request body and request URL to look like.

```
POST
localhost:8080/login
{
    "username": "johndoe",
    "password": "pleasedonthackme"
}
```

The code will go something like this:

```
app.post('/login', function(req, res){
    const body = req.body;
    console.log(body)
    const username = body.username;
    const password = body.password;

    // Start processing of username and password
    let isUsernameCorrect = false;
    let isPasswordCorrect = false;
    if (username === 'johndoe'){
        isUsernameCorrect = true;
    }

    if (password === 'pleasedonthackme'){
        isPasswordCorrect = true;
    }
    let message = "Unauthorized. Incorrect username and password";
    if (isUsernameCorrect && isPasswordCorrect){
        message = "You have logged in! Welcome John";
    }
    // End processing of username and password
    res.send(message)
})
```

What is happening here?

1. req.body give the json object of the body sent by the client.
2. We console.log the body just to see how the structure of the body is like.
3. Extract the username and password from the information.
4. Processing the information to see if its an authorized login.
5. Send response to client with a message

\*\*NOTE: NEVER STORE YOUR PASSWORDS THIS WAY. THIS IS JUST FOR DEMONSTARTION PURPOSES. ANY SENSTIVE INFORMATION SHOULD WE STORED IN A SEPERATE FILE ON YOUR LOCAL MACHINE. IT IS USUALLY CALLED THE ENV FILE.
