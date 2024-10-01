import logger from '../logger';

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { metadata: err });
  res.status(500).json({ message: 'Internal Server Error' });
};

export default errorHandler;
