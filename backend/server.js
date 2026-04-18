//start the server

//load env variables
//start server

//Import app
const app = require("./app")
const connectDatabase = require("./db")

//import dotenv
const dotenv = require("dotenv");

// Handle Uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.stack}`);
  console.log("Shutting down server due to uncaught exception");
  process.exit(1);
});

//Load config
const path = require("path");
dotenv.config({ path: path.join(__dirname, "config", "config.env") });
console.log("MONGO_URI:", process.env.MONGO_URI);

//connect to database
connectDatabase();

//start the server

const server = app.listen(process.env.PORT,() =>{
    console.log(`Server is running on port ${process.env.PORT}`);
})

// Handle Unhandled Promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log("Shutting down server due to Unhandled Promise rejection");
  server.close(() => process.exit(1));
});