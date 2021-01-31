require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const mockPath = path.join(__dirname, process.env.MOCKS_DIRECTORY);
const logsMode = process.env.ENABLE_LOGS || "none";

// Method to return data
function resolveEndpoint(response, service) {
  let res = null;
  response.set("Content-Type", service.response.contentType);
  response.status(service.response.status);
  if (service.response.file) {
    try {
      // External file
      res = fs.readFileSync(`${mockPath}/${service.response.file}`, "utf8");
    } catch (err) {
      // Error reading file
      console.log(
        `Unable to read file content ${mockPath}/${service.response.file}: ${err}`
      );
      const contentType = service.response.contentType.toLowerCase();
      res =
        contentType === "application/json"
          ? { error: "Unhandled error" }
          : contentType === "text/xml"
          ? "<?xml version='1.0' encoding='UTF-8'?><error>Unhandled error</error>"
          : "Unhandled error";
    }
  } else {
    // Mock body
    res = service.response.body || "";
  }
  // Return response
  if (logsMode === "responses" || logsMode === "all") {
    console.log("Response", res);
  }
  response.send(res);
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
          if (logsMode === "requests" || logsMode === "all") {
            const { headers, body } = req;
            console.log("Request", { headers, body });
          }
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
