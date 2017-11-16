/* eslint-disable */
const chai = require('chai');

chai.should();
const expect = chai.expect;

const formatters = require('../dist/formatters');

describe('Helper Functions', () => {
  it('Should return funcion SendResponse', () => {
    formatters.should.have.property('sendResponse');
    formatters.sendResponse.should.be.a('function');
  });
  it('Should return function SendDataResponse', () => {
    formatters.should.have.property('sendDataResponse');
    formatters.sendResponse.should.be.a('function');
  });
});
