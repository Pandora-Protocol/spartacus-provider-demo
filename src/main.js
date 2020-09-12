const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const config = require('../config/config')

console.log("Spartacus Provider Demo started")

const app = express();

// middleware
app.use(cors());
app.use(bodyParser.json());

app.set('view engine', 'pug')

app.get('/', function (req, res) {
    res.json({
        app: config.APP,
        version: config.VERSION,
    });
})

app.get('/challenge/:hash', function (req, res) {

    const {hash} = req.params;
    if (!hash || hash.length !== 64 )
        return res.render('error', {title: config.APP, error: 'Error hash'})

    res.render('index', { title: config.APP, sitekey: config.HCAPTCHA.SITE_KEY, hash })
})

app.post('/sign', function (req, res){

    const {hash, token} = req.body;

    if (!hash || hash.length !== 64 )
        return res.render('error', {title: config.APP, error: 'Error hash'})

})

const server = app.listen(8081, function () {

    const host = server.address().address
    const port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

})