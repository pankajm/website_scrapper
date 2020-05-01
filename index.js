const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const route = require('./route')
const morgan = require('morgan');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listning on port ${port}`);
});

app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())

app.use(morgan('tiny'));

app.use('/api/crawl', route);
