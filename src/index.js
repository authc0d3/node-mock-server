require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const mockPath = path.join(__dirname, process.env.MOCKS_DIRECTORY);

// Method to return data
function resolveEndpoint(response, service) {
  response.set("Content-Type", service.response.contentType);
  response.status(service.response.status);
  if (service.response.file) {
    try {
      const raw = fs.readFileSync(`${mockPath}/${service.response.file}`);
      response.send(raw);
    } catch (err) {
      console.log(
        `Unable to read file content ${mockPath}/${service.response.file}: ${err}`
      );
    }
  } else {
    response.send(service.response.body);
  }
}

// Server config
const server = express();
server.use(morgan(process.env.MORGAN_MODE || "combined"));
server.use(express.json());
server.use(cors());

// Load all endpoints from mocks directory
fs.readdir(mockPath, (err, files) => {
  if (err) {
    return console.log("Unable to load mocks directory: " + err);
  }
  files.forEach((file) => {
    if (path.extname(file).toLowerCase() === ".json") {
      try {
        // Read mock files and mount endpoints
        const raw = fs.readFileSync(`${mockPath}/${file}`);
        const service = JSON.parse(raw);
        server[service.method.toLowerCase()](service.endpoint, (req, res) => {
          if (service.sleep) {
            setTimeout(() => resolveEndpoint(res, service), service.sleep);
          } else {
            resolveEndpoint(res, service);
          }
        });
      } catch (err) {
        console.log(`Unable to initialize service ${file}: ${err}`);
      }
    }
  });
});

// Server listening...
server.listen(process.env.APP_PORT || 4000, async () => {
  console.log(`Server running on port ${process.env.APP_PORT || 4000}...`);
});
