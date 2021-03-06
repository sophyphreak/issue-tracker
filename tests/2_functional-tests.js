/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
require('../db/mongoose');
const { Issue } = require('../models/issue');
const moment = require('moment');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('POST /api/issues/{project} => object with issue data', () => {
    test('Every field filled in', done => {
      chai
        .request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res) {
          try {
            assert.equal(res.status, 200);
            const {
              issue_title,
              issue_text,
              created_by,
              assigned_to,
              status_text
            } = res.body;
            assert.equal(issue_title, 'Title');
            assert.equal(issue_text, 'text');
            assert.equal(created_by, 'Functional Test - Every field filled in');
            assert.equal(assigned_to, 'Chai and Mocha');
            assert.equal(status_text, 'In QA');
            done();
          } catch (e) {
            done(e);
          }
        });
    });

    test('Required fields filled in', done => {
      chai
        .request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in'
        })
        .end(function(err, res) {
          try {
            assert.equal(res.status, 200);
            const { issue_title, issue_text, created_by } = res.body;
            assert.equal(issue_title, 'Title');
            assert.equal(issue_text, 'text');
            assert.equal(created_by, 'Functional Test - Every field filled in');
            done();
          } catch (e) {
            done(e);
          }
        });
    });

    test('Missing required fields', done => {
      chai
        .request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          created_by: 'Functional Test - Every field filled in'
        })
        .end(function(err, res) {
          try {
            assert.equal(res.status, 400);
            done();
          } catch (e) {
            done(e);
          }
        });
    });
  });

  suite('PUT /api/issues/{project} => text', function() {
    test('No body', done => {
      const issue = new Issue({
        issue_title: 'PUT Test',
        issue_text: 'text',
        created_by: 'Functional Test - Every field filled in',
        assigned_to: 'Chai and Mocha',
        status_text: 'In QA',
        project: test,
        created_on: moment(),
        updated_on: moment(),
        open: true
      });
      issue.save((err, issue) => {
        chai
          .request(server)
          .put('/api/issues/test')
          .send({
            _id: issue.id
          })
          .end((err, res) => {
            try {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'no updated field sent');
              done();
            } catch (e) {
              done(e);
            }
          });
      });
    });

    test('One field to update', done => {
      const issue = new Issue({
        issue_title: 'PUT Test 2',
        issue_text: 'text',
        created_by: 'Functional Test - Every field filled in',
        assigned_to: 'Chai and Mocha',
        status_text: 'In QA',
        project: test,
        created_on: moment(),
        updated_on: moment(),
        open: true
      });
      issue.save((err, issue) => {
        chai
          .request(server)
          .put('/api/issues/test')
          .send({
            _id: issue.id,
            issue_text: 'NEW NEW NEW MESSAGE TEXT'
          })
          .end((err, res) => {
            try {
              assert.equal(res.status, 200);
              assert.equal(res.body.issue_text, 'NEW NEW NEW MESSAGE TEXT');
              done();
            } catch (e) {
              done(e);
            }
          });
      });
    });
    test('Multiple fields to update', function(done) {
      const issue = new Issue({
        issue_title: 'PUT Test 3',
        issue_text: 'text',
        created_by: 'Functional Test - Every field filled in',
        assigned_to: 'Chai and Mocha',
        status_text: 'In QA',
        project: test,
        created_on: moment(),
        updated_on: moment(),
        open: true
      });
      issue.save((err, issue) => {
        chai
          .request(server)
          .put('/api/issues/test')
          .send({
            _id: issue.id,
            issue_title: 'PUT TESTS FINSIHEDDDD NOW',
            issue_text: 'NEW NEW NEW NEW NEW NEW MESSAGE TEXT',
            created_by: 'me me me me '
          })
          .end((err, res) => {
            try {
              assert.equal(res.status, 200);
              assert.equal(res.body.issue_title, 'PUT TESTS FINSIHEDDDD NOW');
              assert.equal(
                res.body.issue_text,
                'NEW NEW NEW NEW NEW NEW MESSAGE TEXT'
              );
              assert.equal(res.body.created_by, 'me me me me');
              done();
            } catch (e) {
              done(e);
            }
          });
      });
    });
  });

  suite(
    'GET /api/issues/{project} => Array of objects with issue data',
    function() {
      test('No filter', function(done) {
        chai
          .request(server)
          .get('/api/issues/test')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'updated_on');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], 'assigned_to');
            assert.property(res.body[0], 'open');
            assert.property(res.body[0], 'status_text');
            assert.property(res.body[0], '_id');
            done();
          });
      });

      test('One filter', function(done) {
        chai
          .request(server)
          .get('/api/issues/test?open=true')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'updated_on');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], 'assigned_to');
            assert.property(res.body[0], 'open');
            assert.property(res.body[0], 'status_text');
            assert.property(res.body[0], '_id');
            done();
          });
      });

      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai
          .request(server)
          .get('/api/issues/test?open=true&created_by=me me me me')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'updated_on');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], 'assigned_to');
            assert.property(res.body[0], 'open');
            assert.property(res.body[0], 'status_text');
            assert.property(res.body[0], '_id');
            done();
          });
      });
    }
  );

  suite('DELETE /api/issues/{project} => text', function() {
    test('No _id', done => {
      const issue = new Issue({
        issue_title: 'DELETE Test',
        issue_text: 'this should not be here',
        created_by: 'if im here that bad',
        assigned_to: 'very bad',
        status_text: 'bad bad bad',
        project: test,
        created_on: moment(),
        updated_on: moment(),
        open: true
      });
      issue.save((err, issue) => {
        chai
          .request(server)
          .delete('/api/issues/test')
          .end((err, res) => {
            try {
              assert.equal(res.text, '_id error');
              done();
            } catch (e) {
              done(e);
            }
          });
      });
    });

    test('Valid _id', function(done) {
      const issue = new Issue({
        issue_title: 'DELETE Test',
        issue_text: 'this should not be here',
        created_by: 'if im here that bad',
        assigned_to: 'very bad',
        status_text: 'bad bad bad',
        project: test,
        created_on: moment(),
        updated_on: moment(),
        open: true
      });
      issue.save((err, issue) => {
        chai
          .request(server)
          .delete('/api/issues/test/')
          .send({
            _id: issue.id
          })
          .end((err, res) => {
            try {
              // assert.equal(res.status, 200);
              assert.equal(res.text, `deleted ${issue.id}`);
              done();
            } catch (e) {
              done(e);
            }
          });
      });
    });
  });
});
