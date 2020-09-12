module.exports = {

    marshalNumberFixed( num, length){

        if (length > 7) throw "marshalNumberFixed length is way too big";
        if (!length) throw "marshalNumberFixed length is not specified";

        const b = Buffer.alloc(length);

        let p = length-1;
        while (num > 0){

            b[p] = num % 256;
            num /= 256;

            p--;
        }

        return b;

    }

}