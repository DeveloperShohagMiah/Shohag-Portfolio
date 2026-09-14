class ApiError extends Error {
    constructor(statusCode, message = 'Something went wrong') {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace?.(this, this.constructor);
    }
}

export default ApiError;
