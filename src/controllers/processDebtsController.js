import path from 'path';
import fs from 'fs';

import { generateCsv, generatePdf, processCsv } from '../utils/processFiles';

/**
 * Process CSV File Debts controller class
 */
class DataProcessController {
  /**
   * Controller Function to process a CSV File to calculate debts
   * @param {Request} req Express Request
   * @param {Response} res Express Response
   * @param {NextFunction} next Express NextFunction
   * @returns {object} Response from Processing the CSV File
   */
  static async processCsvData(req, res, next) {
    try {
      const fileToBeProcessed = req.file.path || '';

      if (fileToBeProcessed === '') {
        return res.status(400).json({
          status: res.statusCode,
          message: 'File to be processed is missing.',
        });
      }
      const result = await processCsv(req.file.path);
      const csvFilePath = await generateCsv(result);
      const pdfFilePath = await generatePdf(result);

      const baseUrl = `${req.protocol}://${req.get('host')}`;

      // Construct the downloadable links for the CSV and PDF
      const csvDownloadLink = `${baseUrl}/processed_files/${path.basename(
        csvFilePath
      )}`;
      const pdfDownloadLink = `${baseUrl}/processed_files/${path.basename(
        pdfFilePath
      )}`;

      // Return the processed result and download links
      return res.status(200).json({
        status: 200,
        message: 'File has been processed successfully',
        csvFile: csvDownloadLink,
        pdfFile: pdfDownloadLink,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   *  Download Processed files
   * @param {Request} req Express Request
   * @param {Response} res Express Response
   * @param {NextFunction} next NextFunction
   * @returns {object} Response after generating download link to processed file
   */
  static async downloadProcessedFiles(req, res, next) {
    try {
      const { filename } = req.params;
      const processedFilesDir = path.join(__dirname, '..', 'processed_files');
      const filepath = path.join(processedFilesDir, filename);

      // Check if the file exists
      if (fs.existsSync(filepath)) {
        res.download(filepath);
      } else {
        res.status(404).json({
          status: 404,
          message: 'File not found',
        });
      }
    } catch (error) {
      next(error);
    }
  }
}

export default DataProcessController;
