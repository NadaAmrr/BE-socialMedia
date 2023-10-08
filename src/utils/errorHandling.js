//Error handling function
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    return fn(req, res, next).catch((error) => {
      if (error.message === "jwt expired") {
        return res.status(401).json({ message: "Invalid account" });
      }
      return next(new Error(error));
    });
  };
};
//Error handling global middleware
export const globalErrorHandling = (error, req, res, next) => {
  return res
    .status(error.status || 400)
    .json({
      message: "G Error",
      messageError: error.message,
    //   stack: error.stack,
    });
};
