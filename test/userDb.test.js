/* eslint-disable */
const chai = require('chai');

chai.should();

const db = require('../dist/userDb');
const mongoose = require('mongoose');

const temp = {
  id: 'test@user.com',
  email: 'demo1@cisco.com',
  message: 'Test message. ',
};

describe('Database Functions', () => {
  after(function() {
    mongoose.connection.close();
  });
  it('Should add email to user object', async function() {
    const user = await db.addEmail(temp.id, temp.email);
    temp._id = user._id;
    user.should.have.property('iotGroup');
    user.iotGroup.should.be.an('Array').that.includes(temp.email);
    user.should.have.property('_id');
    user.should.have.property('email');
    user.email.should.equal(temp.id);
  });
  it('Should remove email from user object', async function() {
    const user = await db.removeEmail(temp.id, temp.email);
    user.should.have.property('iotGroup');
    user.iotGroup.should.be.an('Array').that.does.not.include(temp.email);
    user.should.have.property('email');
    user.email.should.equal(temp.id);
  });
  it('Should add a message to the user object', async function() {
    const user = await db.addMessage(temp.id, temp.message);
    user.should.have.property('iotMessage');
    user.iotMessage.should.equal(temp.message);
    user.should.have.property('email');
    user.email.should.equal(temp.id);
  });
  it('Should list all group emails. ', async function() {
    const user = await db.getUser(temp.id);
    user.iotGroup.should.be.an('Array');
  });
  it('Should findbyId', async function() {
    const user = await db.getUserbyId(temp._id);
    user._id.should.deep.equal(temp._id);
  });
});

