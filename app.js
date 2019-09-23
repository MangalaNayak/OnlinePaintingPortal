const express = require('express');
require('./config/mongodb');
const config = require('./config/config')
const bodyParser = require('body-parser');
const user = require('./routes/user.js')

const app = express();
app.use(bodyParser.json());

app.use('/users', user);
app.listen(config.port, () => {
    console.log(`Server is running on port number : ${config.port}`);
});
