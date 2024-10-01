import express from 'express';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';

import swaggerSetup from '../swagger';
import dataProcessRoute from './routes/debtsCalculationRoute';
import errorHandler from './middleware/errorHandler';

const app = express();

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);
const processedFilesDir = path.join(__dirname, 'processed_files');
app.use('/processed_files', express.static(processedFilesDir));
app.use('/api/v1', dataProcessRoute);

const PORT = process.env.PORT || 5001;

swaggerSetup(app);

app.listen(PORT, () => console.log(`listening to port ${PORT}`));

export default app;
