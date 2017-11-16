/* eslint-disable */
const chai = require('chai');
chai.should();
const expect = chai.expect;

const { iotEvent, fireEvent } = require('../dist/iotEvent');
const db = require('../dist/userDb');

describe('IOTEvent Module', function () {
  it('Should Expose iotEvent', function () {
    iotEvent.should.be.a('function');
  });
  it('Should Expose FireEvent', function () {
    fireEvent.should.be.a('function');
  });
});

describe('FireEvent Function', function () {
  before(async function() {
    await db.addEmail('test@user.com', 'aman.chhabra1+colonel@gmail.com');
    await db.addEmail('test@user.com', 'aman.chhabra1+bear@gmail.com');
    await db.addMessage('test@user.com', 'Mocha Test Message');
  });
  it('Should find user and create spark space', async function () {
    this.timeout(10000);
    const options = {
      id: '5a0b7860434de9a0a34f07f0',
      title: 'Mocha Test Event',
      call: false,
      data: 'Blank'
    };
    try {
      return await fireEvent(options)
    }
    catch (e) {
      throw e;
    }
  });
  after(async function() {
    await db.removeEmail('test@user.com', 'aman.chhabra1+colonel@gmail.com');
    await db.removeEmail('test@user.com', 'aman.chhabra1+bear@gmail.com');
  });
});

describe('IOTEvent Function', function () {
  it('Should Handle Incoming HTTP Post Message', function () {
    return true;
  });
});