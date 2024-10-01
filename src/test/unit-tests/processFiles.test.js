import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { processCsv, generateCsv, generatePdf } from '../../utils/processFiles'; // Adjust the path

describe('CSV Files Processing', () => {
  const mockData = [
    { personA: 'Alex', personB: 'Beatrice', total: 120.54 },
    { personA: 'Beatrice', personB: 'Alex', total: 5.74 },
    { personA: 'Carl', personB: 'Alex', total: 60.88 },
    { personA: 'Carl', personB: 'Beatrice', total: 25.3 },
    { personA: 'Beatrice', personB: 'Carl', total: 168.08 }
  ];

  const processedFilesDir = path.join(__dirname, '../processed_files');
  const testFilePath = path.join(__dirname, 'test.csv');

  before(() => {
    // Create the directory for processed files before running tests
    if (!fs.existsSync(processedFilesDir)) {
      fs.mkdirSync(processedFilesDir, { recursive: true });
    }
  });

  after(() => {
    // Clean up the processed files directory after all tests
    if (fs.existsSync(processedFilesDir)) {
      fs.rmdirSync(processedFilesDir, { recursive: true });
    }
    // Clean up the test file if it exists
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  it('should process CSV correctly', async () => {
    const csvContent = 'Alex,Beatrice,120.54\nBeatrice,Alex,5.74\nCarl,Alex,60.88\nCarl,Beatrice,25.3\nBeatrice,Carl,168.08\n';

    fs.writeFileSync(testFilePath, csvContent);

    const result = await processCsv(testFilePath);
    expect(result).to.deep.equal(mockData);

    // Clean up the test file
    fs.unlinkSync(testFilePath);
  });

  it('should generate a CSV file with a unique timestamp and return the correct file path', async () => {
    // Call generateCsv and capture the file path
    const filePath = await generateCsv(mockData);
    // Ensure the file was created
    // eslint-disable-next-line no-unused-expressions
    expect(fs.existsSync(filePath)).to.be.true;
    // Read the contents of the file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    // Expected content including headers
    const expectedContent = [
      'personA,personB,total',
      'Alex,Beatrice,120.54',
      'Beatrice,Alex,5.74',
      'Carl,Alex,60.88',
      'Carl,Beatrice,25.3',
      'Beatrice,Carl,168.08'
    ].join('\n');

    // Validate the content matches what we expect
    expect(fileContent.trim()).to.equal(expectedContent);
    // Clean up by deleting the file
    fs.unlinkSync(filePath);
  });

  it('should generate a PDF file with a unique timestamp and return the correct file path', async () => {
    // Call generatePdf and capture the file path
    const filePath = await generatePdf(mockData);
    // Ensure the file was created
    // eslint-disable-next-line no-unused-expressions
    expect(fs.existsSync(filePath)).to.be.true;
    // Clean up by deleting the file
    fs.unlinkSync(filePath);
  });
});
