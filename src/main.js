const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const hcaptcha = require('hcaptcha');
const eccrypto = require("pandora-protocol-eccrypto");

const MarshalUtils = require('./utils/marshal-utils')
const CryptoUtils = require('./utils/crypto-utils')

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

    try{

        const {hash} = req.params;
        if (!hash || hash.length !== 64 )
            throw "Invalid hash"

        res.render('index', { title: config.APP, sitekey: config.HCAPTCHA.SITE_KEY, hash })

    }catch(err){
        res.render('error', {title: config.APP, error: err.toString() })
    }
})

app.post('/sign', async function (req, res){

    try{

        const {hash, token} = req.body;

        if (!hash || hash.length !== 64 )
            throw "Invalid Hash";

        const data = await hcaptcha.verify( config.HCAPTCHA.SECRET_KEY, token)

        if (!data.success) throw "Invalid token";

        const time = new Date().getTime()/1000;
        const message = Buffer.concat([
            Buffer.from(hash, 'hex'),
            MarshalUtils.marshalNumber(time),
        ]);

        const signature = eccrypto.sign(config.PRIVATE_KEY, CryptoUtils.sha256(message) );

        res.json({
            success: true,
            signature: signature.toString('hex'),
            time,
        })

    }catch(err){
        res.json({ error: err.toString() });
    }


})

const server = app.listen(8081, function () {

    const host = server.address().address
    const port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

})