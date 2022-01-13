//this file defines the Express application and connects routers
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");
const cors = require("cors");

const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound");
const reservationsRouter = require("./reservations/reservations.router");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/reservations", reservationsRouter);

// //==========================use this to merge front and back end, need a build folder===================//
// // Serve static files from the React frontend app
// app.use(express.static(path.join(__dirname, '../frontend/build')))
// // AFTER defining routes: Anything that doesn't match what's above, send back index.html; (the beginning slash ('/') in the string is important!)
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname + :"../frontend/build", "index.html"));
// })


app.use(notFound);
app.use(errorHandler);

module.exports = app;
