/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import handleMulterError from '../middleware/handleMulterError';

describe('handleMulterErrors Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {}; // Mock request object
    res = {
      status() { return this; }, // Mock status method to chain
      json() {} // Mock json method to capture response
    };
    sinon.spy(res, 'status'); // Spy on res.status
    sinon.spy(res, 'json'); // Spy on res.json
    next = sinon.spy(); // Spy on next function
  });

  it('should respond with 400 status and error message when there is an error', () => {
    const error = new Error('File upload failed');

    handleMulterError(error, req, res, next);

    // Check that res.status was called with 400
    expect(res.status.calledWith(400)).to.be.true;
    // Check that res.json was called with the correct error message
    // eslint-disable-next-line no-unused-expressions
    expect(res.json.calledWith({
      status: 'error',
      message: error.message,
    })).to.be.true;
    // Ensure next was not called
    expect(next.called).to.be.false;
  });

  it('should call next when there is no error', () => {
    handleMulterError(null, req, res, next);

    // Check that next was called
    expect(next.called).to.be.true;
    // Ensure res.status and res.json were not called
    expect(res.status.called).to.be.false;
    expect(res.json.called).to.be.false;
  });
});
