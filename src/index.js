require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

// Method to return data
function resolveEndpoint(response, service) {
  response.set("Content-Type", service.response.contentType);
  response.status(service.response.status);
  response.send(service.response.body);
}

// Server config
const server = express();
server.use(morgan(process.env.MORGAN_MODE || "combined"));
server.use(express.json());
server.use(cors());

// Load all endpoints from mocks directory
const mockPath = path.join(__dirname, process.env.MOCKS_DIRECTORY);
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
      } catch {
        return console.log(`Unable to initialize service ${file}`);
      }
    }
  });
});

// Server listening...
server.listen(process.env.APP_PORT || 4000, async () => {
  console.log(`Server running on port ${process.env.APP_PORT || 4000}...`);
});
