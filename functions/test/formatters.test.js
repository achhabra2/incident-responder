/* eslint-disable */
const chai = require('chai');
const sinon = require('sinon');
chai.should();
const expect = chai.expect;

const formatters = require('../dist/formatters');

const user = {
  "_id": "5a0ef9da2da3ff1a6cde255d",
  "email": "amachhab@apinerds.org",
  "iotGroup": [
    "amachhab@apinerds.org",
    "live-helper@sparkbot.io"
  ]
};

describe('Formatters Module', () => {
  it('Should expose funcion SendResponse', () => {
    formatters.should.have.property('sendResponse');
    formatters.sendResponse.should.be.a('function');
  });
  it('Should expose function getPersonStr', () => {
    formatters.should.have.property('getPersonStr');
    formatters.sendResponse.should.be.a('function');
  });
});

describe('Get Person String', function () {
  it('Should return a string. ', function () {
    formatters.getPersonStr(user).should.be.a('string');
  });
});

describe('SendResponse', function () {
  it('Should call res.json() with string input', function () {
    let response = {
      json: sinon.spy()
    };
    formatters.sendResponse(response, 'Test message');
    response.json.calledOnce.should.be.true;
    let call = response.json.getCall(0);
    call.args[0].should.have.property('speech');
    call.args[0].should.have.property('displayText');
  });
});

describe('FollowUp Response', function () {
  it('Should call res.json() with input', function () {
    let response = {
      json: sinon.spy()
    };
    let event = {
      name: 'Mock Event',
      data: {
        emails: ['email@domain.com']
      }
    };
    formatters.followupResponse(response, event);
    response.json.calledOnce.should.be.true;
    let call = response.json.getCall(0);
    call.args[0].should.have.property('speech');
    call.args[0].should.have.property('displayText');
  });
});