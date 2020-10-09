const KAD = require('pandora-protocol-kad-reference')

const sybilKeys = KAD.helpers.ECCUtils.createPair();

console.info("SYBIL PRIVATE KEY", sybilKeys.privateKey.toString('hex') );
console.info("SYBIL PUBLIC KEY", sybilKeys.publicKey.toString('hex') );