const express = require("express");
const dotenv = require("dotenv");
const connectDatabase = require("./helpers/database/connectDatabase");
const customErrorHandler = require("./middlewares/errors/customErrorHandler");
const routers = require("./routers/index");
const path = require("path");

// Environment variables 
dotenv.config({
    path: "./config/env/config.env"
});

// Database Connection 
connectDatabase();


const app = express();
// Express - Body Middleware
app.use(express.json());


const PORT = process.env.PORT;

// Routers MiddleWare
app.use("/api",routers);

// Error Handlers
app.use(customErrorHandler);

// Static files
app.use(express.static(path.join(__dirname,"public")));

app.listen(PORT, () => {
    console.log(`App started on ${PORT}: ${process.env.NODE_ENV}`);
});