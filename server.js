"use strict";
require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const expect = require("chai").expect;
const cors = require("cors");
const helmet = require("helmet");
const lodash = require("lodash");
const moment = require('moment');

const apiRoutes = require("./routes/api.js");
const fccTestingRoutes = require("./routes/fcctesting.js");
const runner = require("./test-runner");
const { Issue } = require('./models/issue');

const app = express();

app.use(helmet());
app.use("/public", express.static(process.cwd() + "/public"));

app.use(cors({ origin: "*" })); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Sample front-end
app.route("/:project/").get(function(req, res) {
  res.sendFile(process.cwd() + "/views/issue.html");
});

//Index page (static HTML)
app.route("/").get(function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API
apiRoutes(app);

app.post('/api/issues/:projectname', async (req, res) => {
  try {
    const project = req.params.projectname;
    let body = _pick(req.body, ['issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text']);
    body.project = project;
    body.created_on = moment();
    body.updated_on = moment();
    body.open = true;
    const issue = new Issue(body);
    const doc = await issue.save();
    res.send(doc);
  } catch (e) {
    res.status(400).send(e);
  }
});

//404 Not Found Middleware
app.use(function(req, res, next) {
  res
    .status(404)
    .type("text")
    .send("Not Found");
});

//Start our server and tests!
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port " + listener.address().port);
  if (process.env.NODE_ENV === "test") {
    console.log("Running Tests...");
    setTimeout(function() {
      try {
        runner.run();
      } catch (e) {
        var error = e;
        console.log("Tests are not valid:");
        console.log(error);
      }
    }, 3500);
  }
});

module.exports = app; //for testing
