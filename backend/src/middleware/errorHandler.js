const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.stack);

    // Default to 500 server error
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        error: message,
    });
};

module.exports = errorHandler;
