module.exports = {

    marshalNumberBufferFast(number){
        let str = number.toString(16);
        if (str%2 === 1) str = '0'+str;
        return Buffer.from(str, 'hex');
    }

}