const handleMulterError = (err, req, res, next) => {
  if (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    });
  } else {
    next();
  }
};

export default handleMulterError;
