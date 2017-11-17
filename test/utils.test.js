/* eslint-disable */
const chai = require('chai');
chai.should();
const expect = chai.expect;

const { sipCall, fireEvent } = require('../dist/utils');
const db = require('../dist/userDb');
const mongoose = require('mongoose');
const { MONGO_URI } = require('../config');

describe('Utils Module', function () {
  it('Should Expose FireEvent', function () {
    fireEvent.should.be.a('function');
  });
});

describe('FireEvent Function', function () {
  before(async function () {
    await mongoose.connect(
      MONGO_URI,
      { useMongoClient: true },
    );
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
    return await fireEvent(options)
  });
  it('Should throw an error when there is no user.', async function () {
    const options = {
      email: 'blank',
      title: 'Mocha Test Event',
      call: false,
      data: 'Blank'
    };
    try {
      await fireEvent(options)
    }
    catch (error) {
      error.should.be.an('error');
    }
  });
  after(async function () {
    await db.removeEmail('test@user.com', 'aman.chhabra1+colonel@gmail.com');
    await db.removeEmail('test@user.com', 'aman.chhabra1+bear@gmail.com');
    mongoose.connection.close();
  });
});