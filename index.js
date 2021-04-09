const express = require('express');
const path = require('path');
const app = express();
const logger = require('./middleware/logger');
const requestIp = require('request-ip');
const fileupload = require('express-fileupload');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static('assets/image'));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(logger);
app.use(fileupload());
app.use(requestIp.mw())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//get all users
app.use('/api/registerforms', require('./routes/api/registerforms'));
app.use('/api/login', require('./routes/api/login'));
app.use('/api/image', require('./routes/api/image'));
app.use('/api/news', require('./routes/api/news'));
app.use('/api/events', require('./routes/api/events'));
app.use('/api/benefits', require('./routes/api/benefits'));
app.use('/api/meeting', require('./routes/api/meeting'));
app.use('/api/admin', require('./routes/api/admin'));
app.use('/api/banner', require('./routes/api/banner'));

// set static folder

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log('server is running ' + PORT));