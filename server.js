const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const dbConnect = require("./config/database");
const categoryRouter = require("./Routers/categoryRouter");
const subCategoryRouter = require("./Routers/subCategoryRouter");
const brandRouter = require("./Routers/brandRouter");
const productRouter = require("./Routers/productRouter");
const APIError = require("./utils/APIError");
const globalError = require("./middlewares/gloablErrorHandlingMiddelware");

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to the database
dbConnect();

// Middleware
app.use(express.json());
app.use(express.static(__dirname + "/uploads"));
if (process.env.NODE_ENV === "development") {
  console.log("======================================");
  console.log(`Mode: ${process.env.NODE_ENV}`);
  app.use(morgan("dev"));
  console.log("======================================");
}

// Mount routes
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/subcategories", subCategoryRouter);
app.use("/api/v1/brands", brandRouter);
app.use("/api/v1/products", productRouter);

// if the route you send is not found
app.all(/(.*)/, (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 404;
  // next(err);
  next(new APIError(`Can't find ${req.originalUrl} on this server`, 400));
});

// global error handling middleware
app.use(globalError);

// Start the server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`App running on port: ${PORT}`);
});

//Event => this event will call when error happen outside express like db connection this event will do callback function when it call
// Listen for unhandled promise rejections (e.g., database connection failure)
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  // Gracefully shut down the server => Closes the server gracefully to prevent inconsistent states. If there are requests in process, the server will not close until they finish.
  server.close(() => {
    console.error("Server shutting down due to unhandled rejection.");
    process.exit(1);
  });
});

module.exports = app; // Export for testing
