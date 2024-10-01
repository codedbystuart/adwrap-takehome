# 📊 CSV Debt Summarizer

The CSV Debt Summarizer is a simple API that processes CSV files containing monetary debts, summarizes them, and returns the summarized data in both CSV and PDF formats. This project aims to automate the summarization process, making it efficient and accurate.

## 🚀 Features

- Upload a CSV file containing debts.
- Automatically summarize the debts and return the results.
- Download the summarized results in both CSV and PDF formats.
- Validates input to ensure only CSV files are processed.

## 📦 Technologies Used

- Node.js
- Express.js
- Javascript
- Swagger (API Documentation)
- winston (Application Error Logging)
- Multer (for file uploads)
- FastCSV (for CSV generation)
- PDFKit (for PDF generation)

## 📄 Endpoints

### 1. **Upload CSV File**

- **Endpoint:** `POST /api/v1/process-file`
- **Description:** Uploads a CSV file for processing and returns the summarized data.
- **Request:**
  - Form-data: 
    - `file` (type: `file`, required)
- **Response:**
  ```json
  {
      "status": 200,
      "message": "File has been processed successfully",
      "csvFile": "link_to_download_csv",
      "pdfFile": "link_to_download_pdf"
  }
  ```

### 2. **Download Processed Files**

- **Endpoint:** `GET /api/v1/processed/:filename`
- **Description:** Downloads the processed CSV or PDF file by filename.
- **Parameters:**
  - `filename` (type: `string`, required)
- **Response:** Downloads the specified file.

## 🛠️ Project Setup

### 1. **Clone the Repository**
To get started, clone the repository from GitHub using the following command:
```bash
git clone https://github.com/yourusername/csv-debt-summarizer.git
cd csv-debt-summarizer
```

### 2. **Install Dependencies**
Once inside the project directory, install the necessary dependencies by running:
```bash
npm install
```
or if you are using yarn:
```bash
yarn install
```

### 3. **Create Environment Variables**
Make sure to create a `.env` file if the project requires environment variables. For example:
```
PORT=3000
```

### 4. **Run the Project**
To run the development server, use the following command:
```bash
npm run start:dev
```
or if you're using yarn:
```bash
yarn start:dev
```

This will start the server at `http://localhost:3000`.

### 5. **Test the API**
Use a tool like **Postman** or **curl** to test the `/api/v1/process-file` endpoint by uploading a CSV file. The response will contain links to download the processed CSV and PDF files.

Alternatively, Visit `/api-docs` in your browser to use the Swagger documentation and test the endpoints from there.

## 📝 Functions

### `processCsv(filePath: string): Promise<SummaryRecord[]>`
- Reads the content from a CSV file and summarizes the debts.

### `generateCsv(data: SummaryRecord[]): string`
- Generates a CSV file from the summarized data and returns the file path.

### `generatePdf(data: SummaryRecord[]): string`
- Generates a PDF file from the summarized data and returns the file path.

### `downloadProcessedFiles(req: Request, res: Response, next: NextFunction)`
- Handles the download of processed files.

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
