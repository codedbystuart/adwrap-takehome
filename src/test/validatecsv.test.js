/* eslint-disable no-unused-expressions */
import fs from 'fs';
import { expect } from 'chai';
import sinon from 'sinon';
import validateCsvFormat from '../middleware/validateCsvFileDataFormat';

describe('validateCsvFormat Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    next = sinon.spy();
  });

  afterEach(() => {
    sinon.restore(); // Restore the original methods
  });

  it('should return 400 if no file is uploaded', () => {
    validateCsvFormat(req, res, next);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith({ error: 'No file uploaded.' })).to.be.true;
    expect(next.called).to.be.false;
  });

  it('should return 500 if there is an error reading the file', (done) => {
    // Mocking the fs.createReadStream to simulate an error
    const readStreamStub = {
      on: (event, callback) => {
        if (event === 'error') {
          // Simulate an error
          callback(new Error('File read error'));
        }
        return readStreamStub;
      },
      pipe: () => {},
    };
    sinon.stub(fs, 'createReadStream').returns(readStreamStub);

    // Create a mock CSV file path
    req.file = { path: './temp_non_existent.csv' };

    // Call the middleware
    validateCsvFormat(req, res, () => {
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({
        error: 'Error reading the file',
        details: 'File read error',
      })).to.be.true;
      done(); // Call done to indicate the async test is complete
    });
  });

  it('should return 400 if the CSV format is invalid', (done) => {
    // Mocking the fs.createReadStream to simulate reading a file
    const readStreamStub = {
      on: (event, callback) => {
        if (event === 'data') {
          // Simulate reading invalid CSV content
          callback('invalid,line,content\nanother,invalid,line');
        }
        if (event === 'end') {
          // Simulate the end of the stream
          callback();
        }
        return readStreamStub;
      },
      pipe: () => {},
    };
    sinon.stub(fs, 'createReadStream').returns(readStreamStub);

    // Create a mock CSV file path
    req.file = { path: './temp_invalid.csv' };

    // Call the middleware
    validateCsvFormat(req, res, () => {
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({
        error: 'Invalid CSV format',
        details: [
          'Invalid line: invalid,line,content',
          'Invalid line: another,invalid,line',
        ],
      })).to.be.true;
      done(); // Call done to indicate the async test is complete
    });
  });

  after(() => {
    // Cleanup temporary files created during tests
    if (fs.existsSync('./temp_invalid.csv')) {
      fs.unlinkSync('./temp_invalid.csv');
    }
    if (fs.existsSync('./temp_valid.csv')) {
      fs.unlinkSync('./temp_valid.csv');
    }
  });
});
