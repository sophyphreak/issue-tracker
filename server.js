'use strict';
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai').expect;
const cors = require('cors');
const helmet = require('helmet');

const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');

const app = express();

app.use(helmet());
app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({ origin: '*' })); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Sample front-end
app.route('/:project/').get(function(req, res) {
  res.sendFile(process.cwd() + '/views/issue.html');
});

//Index page (static HTML)
app.route('/').get(function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API
apiRoutes(app);

//404 Not Found Middleware
app.use(function(req, res, next) {
  res
    .status(404)
    .type('text')
    .send('Not Found');
});

app.use((err, req, res, next) => {
  let errCode, errMessage;

  if (err.errors) {
    // mongoose validation error
    errCode = 400; // bad request
    const keys = Object.keys(err.errors);
    // report the first validation error
    errMessage = err.errors[keys[0]].message;
  } else {
    // generic or custom error
    errCode = err.status || 500;
    errMessage = err.message || 'Internal Server Error';
  }
  res
    .status(errCode)
    .type('txt')
    .send(errMessage);
});

//Start our server and tests!
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port ' + listener.address().port);
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(function() {
      try {
        runner.run();
      } catch (e) {
        var error = e;
        console.log('Tests are not valid:');
        console.log(error);
      }
    }, 3500);
  }
});

module.exports = app; //for testing
