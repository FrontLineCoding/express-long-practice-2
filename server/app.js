const express = require('express');
const app = express();
require('express-async-errors');
require('dotenv').config();
const dogRouter = require("./routes/dogs");

app.use('/static', express.static('assets'));
app.use(express.json());
app.use((req, res, next) => {
  console.log(process.env.NODE_ENV)
  next();
})
app.use('/dogs', dogRouter);

app.use((req, res, next) => {
  console.log(req.method, req.url);
  console.log(res.statusCode);
  res.on("finish", () => {
    console.log(res.statusCode);
  })
  next();
})

// For testing purposes, GET /
app.get('/', (req, res) => {
  res.json("Express server running. No content provided at root level. Please use another route.");
});

// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.json(req.body);
  next();
});

// For testing express-async-errors
app.get('/test-error', async (req, res) => {
  throw new Error("Hello World!")
});

app.use((req, res, next) => {
  res.status(404);
  let error = new Error("The requested resource couldn't be found.")
  next(error.message);
})

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.statusCode || 500);
  if(process.env.NODE_ENV === 'production'){
    res.json({
    message: err.message || "Something went wrong",
    status: res.statusCode
  })
  } else {
    res.json({
    message: err.message || "Something went wrong",
    status: res.statusCode,
    stack: err.stack
  })
  }
});

const port = 5000;
app.listen(port, () => console.log('Server is listening on port', port));
