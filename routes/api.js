/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

require('../db/mongoose');
const moment = require('moment');
const _ = require('lodash');
const { Issue } = require('../models/issue');
const isUpdateEmpty = require('./handlers/isUpdateEmpty.js');

module.exports = app => {
  app
    .route('/api/issues/:project')

    .get(async (req, res) => {
      try {
        const project = req.params.project;
        const queries = req.query;
        const issueList = await Issue.find({
          project,
          ...queries
        });
        res.send(issueList);
      } catch (e) {
        res.status(400).send(e);
      }
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

    .put(async (req, res) => {
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
        body.project = project;
        body.updated_on = moment();
        if (isUpdateEmpty(body)) {
          res.send('no updated field sent');
        }
        let issue = await Issue.findByIdAndUpdate(body._id, body, {
          new: true
        });
        if (issue === null) {
          res.send(`could not update${body._id}`);
        } else {
          res.send(issue);
        }
      } catch (e) {
        res.status(400).send(3);
      }
    })

    .delete(async (req, res) => {
      let project = req.params.project;
      let body = _.pick(req.body, ['_id']);
      if (!body._id) res.send('_id error');
      const found = await Issue.findByIdAndDelete(body._id);
      if (found) {
        res.send(`deleted ${body._id}`);
      } else {
        res.send(`could not delete ${body._id}`);
      }
    });
};
