/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

// const expect = require('chai').expect;
// const MongoClient = require('mongodb');
// const ObjectId = require('mongodb').ObjectID;
const moment = require('moment');
const { mongoose } = require('../db/mongoose');
const _ = require('lodash');
const { Issue } = require('../models/issue');

// const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = app => {
  app
    .route('/api/issues/:project')

    .get(function(req, res) {
      var project = req.params.project;
    })

    .post(async (req, res) => {
      try {
        const project = req.params.project;
        let body = _.pick(req.body, [
          'issue_title',
          'issue_text',
          'created_by',
          'assigned_to',
          'status_text'
        ]);
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
    })

    .put(function(req, res) {
      try {
        const project = req.params.project;
        let body = _.pick(req.body, [
          '_id',
          'issue_title',
          'issue_text',
          'created_by',
          'assigned_to',
          'status_text',
          'created_on',
          'open'
        ]);
      } catch (e) {
        res.status(400).send(3);
      }
    })

    .delete(function(req, res) {
      var project = req.params.project;
    });
};
