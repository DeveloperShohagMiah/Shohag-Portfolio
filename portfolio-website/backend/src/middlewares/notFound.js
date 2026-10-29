import ApiError from "../utils/apierror.js";


const notFound = (req, res, next) => {
    next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export default notFound;