import express from 'express';
import multer from 'multer';
import DataProcessController from '../controllers/processDebtsController';

import handleMulterError from '../middleware/handleMulterError';
import validateCsvFormat from '../middleware/validateCsvFileDataFormat';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /csv/;
  const isValid = allowedTypes.test(file.mimetype) && allowedTypes.test(file.originalname.split('.').pop());
  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only CSV files are allowed.'), false);
  }
};

const upload = multer({ storage, fileFilter });

const router = express.Router();

/**
 * @swagger
 * /api/v1/process-file:
 *   post:
 *     summary: Summarize Debts of Users on the uploaded CSV file
 *     tags: [Debts]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: The processed data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "File has been processed successfully"
 *                 csvFile:
 *                   type: string
 *                   example: "http://localhost:5001/processed_files/summarized_data_1727770699138.csv"
 *                 pdfFile:
 *                   type: string
 *                   example: "http://localhost:5001/processed_files/summarized_data_1727770699140.pdf"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: "Invalid CSV format"
 *                     details:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [
 *                         "Invalid line: Alex,Beatrice,101.32,ldjaflsd\r",
 *                         "Invalid line: Beatrice,Alex,1.2,ladfjldsf\r",
 *                         "Invalid line: Carl,Alex,45,alkfjdsklf\r",
 *                         "Invalid line: Carl,Beatrice,12.5,lkadflksd\r",
 *                         "Invalid line: Alex,Beatrice,19.22,lfasjdlfk\r",
 *                         "Invalid line: Beatrice,Carl,67.9,ldajflsdkfj\r",
 *                         "Invalid line: Carl,Beatrice,12.8,sdsad\r",
 *                         "Invalid line: Carl,Alex,15.88,dasdas\r",
 *                         "Invalid line: Beatrice,Carl,71.42,dasdsa\r",
 *                         "Invalid line: Beatrice,Alex,4.54,dasdas\r",
 *                         "Invalid line: Beatrice,Carl,28.76,dsadasd"
 *                       ]
 *                 - type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: "No file uploaded."
 */
router.post('/process-file', upload.single('file'), handleMulterError, validateCsvFormat, DataProcessController.processCsvData);

/**
 * @swagger
 * /api/processed/{filename}:
 *   get:
 *     summary: Download the processed file
 *     tags: [Debts]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the file to download
 *     responses:
 *       200:
 *         description: The processed file content
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               example: |
 *                 personA,personB,total
 *                 Alex,Beatrice,120.54
 *                 Beatrice,Alex,5.74
 *                 Carl,Alex,60.88
 *                 Carl,Beatrice,25.3
 *                 Beatrice,Carl,168.08
 *       404:
 *         description: File not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "File not found."
 */
router.get('/processed/:filename', DataProcessController.downloadProcessedFiles);

export default router;
