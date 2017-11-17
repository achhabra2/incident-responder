/* eslint-disable */
const chai = require('chai');
chai.should();
const expect = chai.expect;
const request = require('supertest');

const { iotEvent } = require('../dist/iotEvent');

describe('IOTEvent Module', function () {
  it('Should Expose iotEvent', function () {
    iotEvent.should.be.a('function');
  });
});

describe('IOTEvent Function', function () {
  it('Should throw an error with no user', function (done) {
    const options = {
      title: 'Mocha Test Event',
      call: false,
      data: 'Blank'
    };
    request(iotEvent).post('/')
      .accept('json')
      .type('application/json')
      .send(options)
      .expect(400, done);
  });
  it('Should throw an error with no title', function (done) {
    const options = {
      id: '5a0b7860434de9a0a34f07f0',
      call: false,
      data: 'Blank'
    };
    request(iotEvent).post('/')
      .accept('json')
      .type('application/json')
      .send(options)
      .expect(400, done);
  });
});