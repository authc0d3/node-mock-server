# Node Mock Server

A very simple mock server for NodeJS, made with Express. It use Nodemon to allow dynamic endpoints creation.

## Requirements

You only need [Node.js](https://nodejs.org/), recommended LTS version.

## Get started

1. Clone this repo
2. Install dependencies

```
npm install
```

3. Start the server

```
npm start
```

4. Check if it works on: [http://localhost/4000/json](http://localhost/4000/json)

## Create endpoints

To create custom endpoints only need to add new json files to **/src/mocks** folder, in wich you will also find some endpoint file examples.

By having Nodemon, the server will be updated on any change in endpoint files, so it is not necessary to restart the server manually when creating or modifying endpoints.

## Customize configuration

You can configure some server properties (like port and mocks path) using the **.env** file

## License

[MIT](https://opensource.org/licenses/MIT)
