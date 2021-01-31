# Node Mock Server

A very simple mock server for NodeJS, made with Express. It use Nodemon to allow real time endpoints aggregation.

## Requirements

You only need [Node.js](https://nodejs.org/), recommended LTS version.

## Get started

1. Clone this repo

```
> git clone https://github.com/authc0d3/node-mock-server.git
```

2. Install dependencies

```
> cd node-mock-server
> npm install
```

3. Start the server

```
> npm start
```

4. Check if it works on: [http://localhost:4000/json](http://localhost:4000/json)

## Create endpoints

An example of endpoint file could be like this:

```
{
  "endpoint": "/json",
  "method": "GET",
  "response": {
    "status": 200,
    "contentType": "application/json",
    "body": {
      "from": "Node Mock Server",
      "message": "Hello world!"
    }
  },
  "sleep": 500
}
```

Through this file, the server will mount an endpoint in **http://localhost:4000/json**, which will return a JSON object with the data contained in the body property.

The **sleep** property indicates whether the server should wait a certain time to simulate a longer processing time. If this property is not indicated, the response will be immediate.

By having Nodemon, **the server will be updated on any endpoint files change**, so it is not necessary to restart the server manually when creating or modifying endpoints.

To create custom endpoints **you only need to add new json files to /src/mocks** folder, in wich you will also find other endpoint file examples.

## Customize configuration

You can configure some server properties (like port and mocks path) using the **.env** file.

If you need to simulate requests to external domains you can also configure them in your OS to connect with your localhost (127.0.0.1) and modify the constant **APP_PORT** in the .env file to set the port you need.

## License

[MIT](https://opensource.org/licenses/MIT)
