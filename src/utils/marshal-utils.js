module.exports = {

    marshalNumber(num){

        if (num < 0 || num > Number.MAX_SAFE_INTEGER) throw new Error( "Invalid number");

        const b = Buffer.alloc(8);
        let i, c;

        for (i=0; num >= 0x80; i++){

            c = (num & 0x7f);
            b[i] = c | 0x80;

            num = (num - c) / 0x80;
        }

        b[i] = num;
        i++;

        const b2 = Buffer.alloc(i);
        b.copy(b2, 0, 0, i);
        return b2;
    },

}