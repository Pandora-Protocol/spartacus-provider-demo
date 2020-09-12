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

function challengeHash(req, res){

    try{

        const {hash} = req.params;
        const includeTime = req.params.includeTime === "1";
        const showOutput = req.params.showOutput === "1";

        if (!hash || hash.length !== 64 ) throw "Invalid hash"

        res.render('index', { title: config.APP, sitekey: config.HCAPTCHA.SITE_KEY, hash, includeTime, showOutput })

    }catch(err){
        res.render('error', {title: config.APP, error: err.toString() })
    }
}

app.get('/challenge/:hash', challengeHash )
app.get('/challenge/:hash/:includeTime', challengeHash )
app.get('/challenge/:hash/:includeTime/:showOutput', challengeHash )

app.post('/sign', async function (req, res){

    try{

        const {hash, token} = req.body;
        const includeTime = req.body.includeTime === 1;

        if (!hash || hash.length !== 64 )
            throw "Invalid Hash";

        const data = await hcaptcha.verify( config.HCAPTCHA.SECRET_KEY, token)

        if (!data.success) throw "Invalid token";

        const time = Math.floor( new Date().getTime()/1000 );

        const array = [
            Buffer.from(hash, 'hex'),
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