/* eslint-disable */
const chai = require('chai');
chai.should();
const expect = chai.expect;
const sinon = require('sinon');
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

const dialogflowFulfillment = require('../dist/dialogflow').dialogflowFulfillment;
const payload = require('./postWithContext');
const user_add = require('./samplePost.json');

const app = express();
app.use(bodyParser.json());
app.post('/', dialogflowFulfillment);

describe('Dialogflow app', function () {
  it('Should process user.add', function (done) {
    let result = {
      action: 'user.add',
      parameters: {
        email: ['john@doe.com', 'jane@doe.com']
      }
    };
    let user_add_payload = Object.assign({}, user_add, { result });
    request(app).post('/')
      .accept('json')
      .type('application/json')
      .send(user_add)
      .expect(200, done);
  });
  it('Should process user.delete', function (done) {
    let result = {
      action: 'user.delete',
      parameters: {
        email: ['john@doe.com']
      }
    };
    let user_delete_payload = Object.assign({}, user_add, { result });
    request(app).post('/')
      .accept('json')
      .type('application/json')
      .send(user_delete_payload)
      .expect(200, done);
  });
  it('Should process user.delete.number', function (done) {
    let result = {
      action: 'user.delete.number',
      parameters: {
        number: [1]
      }
    };
    let user_delete_number_payload = Object.assign({}, user_add, { result });
    request(app).post('/')
      .accept('json')
      .type('application/json')
      .send(user_delete_number_payload)
      .expect(200, done);
  });
  it('Should process user.list', function (done) {
    let result = {
      action: 'user.list'
    };
    let user_list_payload = Object.assign({}, user_add, { result });
    request(app).post('/')
      .accept('json')
      .type('application/json')
      .send(user_list_payload)
      .expect(200, done);
  });
  it('Should process endpoint.get', function (done) {
    let result = {
      action: 'endpoint.get'
    };
    let endpoint_get = Object.assign({}, user_add, { result });
    request(app).post('/')
      .accept('json')
      .type('application/json')
      .send(endpoint_get)
      .expect(200, done);
  });
  it('Should process user.messages.add', function (done) {
    let result = {
      action: 'user.messages.add',
      parameters: {
        message: 'TEST IOT MESSAGE'
      }
    };
    let user_messages_add = Object.assign({}, user_add, { result });
    request(app).post('/')
      .accept('json')
      .type('application/json')
      .send(user_messages_add)
      .expect(200, done);
  });
  it('Should process user.messages.get', function (done) {
    let result = {
      action: 'user.messages.get'
    };
    let user_messages_get = Object.assign({}, user_add, { result });
    request(app).post('/')
      .accept('json')
      .type('application/json')
      .send(user_messages_get)
      .expect(200, done);
  });
});