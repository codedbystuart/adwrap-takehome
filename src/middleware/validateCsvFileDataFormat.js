/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
import fs from 'fs';

const validateCsvFormat = (req, res, next) => {
  const { file } = req;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const errors = [];
  const validFormatRegex = /^[a-zA-Z]+,[a-zA-Z]+,\d+(\.\d{1,2})?$/; // Regex to validate format

  // Read the file line by line
  const readStream = fs.createReadStream(file.path, { encoding: 'utf8' });
  let fileContent = '';

  readStream.on('data', (chunk) => {
    fileContent += chunk; // Accumulate file content
  });

  readStream.on('end', () => {
    // Split file content into lines
    const lines = fileContent.split('\n');

    for (const line of lines) {
      if (!line.trim()) continue; // Skip empty lines
      if (!validFormatRegex.test(line.trim())) {
        errors.push(`Invalid line: ${line}`);
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ error: 'Invalid CSV format', details: errors });
    }

    // Proceed to the next middleware/handler if valid
    return next();
  });

  readStream.on('error', (error) => res.status(500).json({ error: 'Error reading the file', details: error.message }));
};

export default validateCsvFormat;
