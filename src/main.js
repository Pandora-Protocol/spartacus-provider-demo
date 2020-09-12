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

function challengeData(req, res){

    try{

        const {data} = req.params;
        const includeTime = req.params.includeTime === "1";
        const showOutput = req.params.showOutput === "1";

        if (!data || !data.length ) throw "Invalid data"

        res.render('index', { title: config.APP, sitekey: config.HCAPTCHA.SITE_KEY, data, includeTime, showOutput })

    }catch(err){
        res.render('error', {title: config.APP, error: err.toString() })
    }
}

app.get('/challenge/:data', challengeData )
app.get('/challenge/:data/:includeTime', challengeData )
app.get('/challenge/:data/:includeTime/:showOutput', challengeData )

app.post('/sign', async function (req, res){

    try{

        const {data, token} = req.body;
        const includeTime = req.body.includeTime === 1;

        if (!data || !data.length)
            throw "Invalid Data";

        const verify = await hcaptcha.verify( config.HCAPTCHA.SECRET_KEY, token)

        if (!verify.success) throw "Invalid token";

        const time = Math.floor( new Date().getTime()/1000 );

        const array = [
            Buffer.from(data, 'hex'),
        ];

        if (includeTime)
            array.push( MarshalUtils.marshalNumberFixed(time, 7) );

        const message = Buffer.concat(array );

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

const server = app.listen( config.PORT, function () {

    const host = server.address().address
    const port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

})