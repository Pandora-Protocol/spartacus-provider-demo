# Spartacus Provider

This repository is a demo/reference for a spartacus provider against sybil attacks.
Spartacus is being used by a KAD Network against Sybil attacks. CPU intensive Proof of Work can be used as well.

### Installation

``` 
git clone https://github.com/Pandora-Protocol/spartacus-provider-demo

cd sparatacus-provider-demo
npm install
```

download, and install the other repositories
```
npm link pandora-protocol-eccrypto ;
```

### Setting up a Spartacus Provider

1. run `node scripts/spartacus-sybil-protect-create-pair.js`
   This will create a sybil protect pair (PrivateKey, PublicKey). 
2. Edit `config/config.js` and replace the `PRIVATE_KEY` with the one you got.
3. Create a https://www.hcaptcha.com/ account
4. After you create the account, copy the **SITE KEY** and **SECRET KEY** from hCaptcha and paste them in `config/config.js`  
5. Run `npm run start`
6. Provide the `PUBLIC KEY` to the `Pandora Protocol ` as a Sybil Protect Public Key

```
const mySybilKeys = {
    publicKey: Buffer.from("00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", 'hex'),
    uri: 'https://domain.com:9090/challenge/', //LINK FOR THE PANDORA PROTOCOL SPARTACUS SYBIL PROTECT CHALLENGE
    origin: 'https://domain.com:9090', //LINK FOR THE PANDORA PROTOCOL SPARTACUS SYBIL PROTECT ORIGIN
}

KAD.init({
    PLUGINS:{
        CONTACT_SYBIL_PROTECT: {
            SYBIL_PUBLIC_KEYS: [ mySybilKeys ],
        }
    }
});

```

## DISCLAIMER: 

This source code is released for educational and research purposes only, with the intent of researching and studying a decentralized p2p protocol for binary data streams.

**PANDORA PROTOCOL IS AN OPEN SOURCE COMMUNITY DRIVEN RESEARCH PROJECT. THIS IS RESEARCH CODE PROVIDED TO YOU "AS IS" WITH NO WARRANTIES OF CORRECTNESS. IN NO EVENT SHALL THE CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES. USE AT YOUR OWN RISK.**

**You may not use this source code for any illegal or unethical purpose; including activities which would give rise to criminal or civil liability.**

**Under no event shall the Licensor be responsible for the activities, or any misdeeds, conducted by the Licensee.**
 