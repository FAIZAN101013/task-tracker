export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

// Central error handler so controllers never have to format failures themselves.
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Mongoose validation errors carry one message per invalid field
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((field) => field.message)
      .join(", ");
  }

  // Duplicate key, e.g. an email that is already registered
  if (err.code === 11000) {
    statusCode = 400;
    message = `That ${Object.keys(err.keyValue).join(", ")} is already in use`;
  }

  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found";
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
