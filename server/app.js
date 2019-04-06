const express = require('express');
const app = express(); 
const mongoose = require('mongoose');

// configure dotenv
const dotenv = require('dotenv');
dotenv.config();

const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 3000;

// connection options
const connectOptions = {
  keepAlive: true, 
  reconnectTries: Number.MAX_VALUE,
  useNewUrlParser: true
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// schema
require('./models/model'); 
// routes
require('./routes/routes') (app);

// views
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
})

// mongoose
mongoose.Promise = global.Promise;
mongoose.connect(mongoURI, connectOptions, (err, db) => {
  if (err) console.log('error ' + err);
  console.log('Connected to MongoDB');
});

app.listen(port, () => {
  console.log('Server started on port ' + port);
})