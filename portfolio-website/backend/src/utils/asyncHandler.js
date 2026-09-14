
const asyncHandler = (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch((err) => {
        console.error(err);
        next(err);
    })
}

export default asyncHandler;