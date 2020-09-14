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

function challengeMessage(req, res){

    try{

        const {message} = req.params;
        const includeTime = req.params.includeTime === "1";
        const showOutput = req.params.showOutput === "1";

        if (!message || message.length !== 64)
            throw "Invalid message";

        res.render('index', { title: config.APP, sitekey: config.HCAPTCHA.SITE_KEY, message, includeTime: includeTime.toString(), showOutput })

    }catch(err){
        res.render('error', {title: config.APP, error: err.toString() })
    }
}

app.get('/challenge/:message', challengeMessage )
app.get('/challenge/:message/:includeTime', challengeMessage )
app.get('/challenge/:message/:includeTime/:showOutput', challengeMessage )

app.post('/sign', async function (req, res){

    try{

        const { token} = req.body;
        let message = Buffer.from(req.body.message, 'hex');

        const includeTime = req.body.includeTime === "true";

        if (!message || message.length !== 32)
            throw "Invalid message";

        const verify = await hcaptcha.verify( config.HCAPTCHA.SECRET_KEY, token)

        if (!verify.success) throw "Invalid token";

        const time = Math.floor( new Date().getTime()/1000 );

        if (includeTime)
            message = CryptoUtils.sha256( Buffer.concat( [
                message,
                MarshalUtils.marshalNumberFixed( time, 7),
            ]) );

        const signature = eccrypto.sign(config.PRIVATE_KEY, message );

        res.json({
            success: true,
            signature: signature.toString('hex'),
            time: (includeTime ? time : undefined),
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