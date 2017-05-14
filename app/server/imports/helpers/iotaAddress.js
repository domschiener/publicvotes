/**
*       Generates a random 81-char (trytes) address 
**/
export const addressGenerator = function() {

    const TRYTES = '9ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    let address = ''

    for (let i = 0; i < 81; i++) {

        address += TRYTES.charAt( Math.floor( Math.random() * 27 ) );

    }

    return address;
}
