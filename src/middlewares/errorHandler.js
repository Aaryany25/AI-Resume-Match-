/**
 * Global Express error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error("[Error Handler]", err);

  const statusCode = err.statusCode || (err.name === "MulterError" ? 400 : 500);

  res.status(statusCode).json({
    success: false,
    message: err.message || "An unexpected error occurred",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};
