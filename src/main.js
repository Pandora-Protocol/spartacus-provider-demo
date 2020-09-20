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

        const json = req.params.json;
        if (!json) throw "data arguments are missing"

        const obj = JSON.parse(json);
        if (!obj) throw "json is invalid";

        const {data, params} = obj;
        if (!data || !params) throw "data or params are missing or invalid";

        if (!data.message || data.message.length !== 64)
            throw "Invalid message";

        res.render('index', {
            title: config.APP,
            sitekey: config.HCAPTCHA.SITE_KEY,
            data: encodeURI(JSON.stringify(data)),
            params: encodeURI(JSON.stringify(params)),
            showOutput: params.showOutput
        })
    }catch(err){
        res.render('error', {title: config.APP, error: err.toString() })
    }
}

app.get('/challenge/:json', challengeData )

app.post('/sign', async function (req, res){

    try{

        const { token, data, params} = req.body;

        data.message = Buffer.from(data.message, 'hex')

        if (!data.message || data.message.length !== 32)
            throw "Invalid message";

        let message = [
            data.message,
        ]

        const verify = await hcaptcha.verify( config.HCAPTCHA.SECRET_KEY, token)

        if (!verify.success) throw "Invalid token";

        let time;
        if (params.includeTime) {
            time = Math.floor( new Date().getTime()/1000 );
            message.push( MarshalUtils.marshalNumberBufferFast(time) );
        }

        message = Buffer.concat(message);
        if (message.length !== 32)
            message = CryptoUtils.sha256(message);

        const signature = eccrypto.sign(config.PRIVATE_KEY, message );

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