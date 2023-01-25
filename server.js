const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const routerBoats = require('./boatsRoute');

const routerSlips = require('./slipsRoute');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.use('/boats', routerBoats);

app.use('/slips', routerSlips);

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});