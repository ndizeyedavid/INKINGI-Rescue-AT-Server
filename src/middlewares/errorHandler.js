// Global error handler middleware
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Log error details for debugging
  console.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
  });

  // Send user-friendly error response
  res.status(500).send("END An error occurred. Please try again later.");
};

// 404 handler
export const notFoundHandler = (req, res) => {
  res.status(404).send("END Service not found.");
};
