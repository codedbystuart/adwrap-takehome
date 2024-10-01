/* eslint-disable no-restricted-syntax */
import fs from 'fs';
import path from 'path';
import * as fastCsv from 'fast-csv';
import PDFDocument from 'pdfkit';

/**
 * This function processes a CSV file and returns a Promise that resolves with the summarized data.
 * @param {string} filePath - The path to the CSV file to be processed.
 * @returns {Promise} A Promise that resolves with the summarized data.
 */
export const processCsv = (filePath) => new Promise((resolve, reject) => {
  const summary = {};
  const records = [];

  // Read the CSV file as text
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return reject(err);
    }

    // Split the content by lines
    const lines = data.trim().split('\n');

    // Process each line
    for (const line of lines) {
      // Split each line by comma
      const [debtor, creditor, amountStr] = line.split(',');

      // Parse the amount
      const amount = parseFloat(amountStr) || 0;

      // Store each debt record
      records.push({ debtor, creditor, amount });

      // Create a unique key for each debtor/creditor relationship
      const key = `${debtor},${creditor}`;

      // Sum the amounts for each unique debtor/creditor relationship
      summary[key] = (summary[key] || 0) + amount;
    }

    // Convert the summary object into an array of SummaryRecord
    const result = Object.entries(summary).map(([key, total]) => {
      const [personA, personB] = key.split(',');
      // Round total to 2 decimal places
      const roundedTotal = Math.round(total * 100) / 100;
      return { personA, personB, total: roundedTotal };
    });

    // Resolve the promise with the summarized data
    resolve(result);
  });
});

/**
 * This function generates a CSV file from the provided data and
 * returns a Promise that resolves with the file path.
 * @param {Array} data - The data to be written to the CSV file.
 * @returns {Promise} A Promise that resolves with the file path.
 */
export const generateCsv = (data) => {
  const processedFilesDir = path.join(__dirname, '..', 'processed_files');

  // Create the directory if it doesn't exist
  if (!fs.existsSync(processedFilesDir)) {
    fs.mkdirSync(processedFilesDir, { recursive: true });
  }

  // Generate a unique file name to avoid overwriting files
  const timestamp = Date.now();
  const csvFilePath = path.join(processedFilesDir, `summarized_data_${timestamp}.csv`);

  return new Promise((resolve, reject) => {
    const ws = fs.createWriteStream(csvFilePath);

    fastCsv
      .write(data, { headers: true })
      .pipe(ws)
      .on('finish', () => {
        resolve(csvFilePath);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

/**
 * This function generates a PDF file from the provided data and
 * returns a Promise that resolves with the file path.
 * @param {Array} data - The data to be written to the PDF file.
 * @returns {Promise} A Promise that resolves with the file path.
 */
export const generatePdf = (data) => {
  const processedFilesDir = path.join(__dirname, '..', 'processed_files');

  // Create the directory if it doesn't exist
  if (!fs.existsSync(processedFilesDir)) {
    fs.mkdirSync(processedFilesDir, { recursive: true });
  }

  // Generate a unique file name to avoid overwriting files
  const timestamp = Date.now();
  const pdfFilePath = path.join(processedFilesDir, `summarized_data_${timestamp}.pdf`);

  return new Promise((resolve, reject) => {
    // Create a new PDF document
    const doc = new PDFDocument();

    // Pipe the PDF document to a writable stream (the PDF file)
    const stream = fs.createWriteStream(pdfFilePath);
    doc.pipe(stream);

    // Write content to the PDF document
    doc.text('Summarized Debts', { align: 'center', underline: true });

    // Iterate over the data and add each record to the PDF
    data.forEach((record) => {
      doc.moveDown();
      doc.text(`${record.personA} owes ${record.personB}: $${record.total.toFixed(2)}`, {
        align: 'left',
      });
    });

    // Finalize the PDF file
    doc.end();

    // Resolve the promise when the PDF is finished writing
    stream.on('finish', () => {
      resolve(pdfFilePath);
    });

    // Handle any errors
    stream.on('error', (error) => {
      reject(error);
    });
  });
};
