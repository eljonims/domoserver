const crypto = require('crypto');
const N_BYTES = 4;

var clave = null;
generar();


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generar(){
    for(let i = 1; i < getRandomInt(10, 100); i++){
        crypto.randomBytes(N_BYTES); //salta aleatoriamente en la secuencia
    }
    clave = crypto.randomBytes(N_BYTES).toString('hex')
    console.log(clave)
}
function comprobar(c){
    if( c === clave){            
        generar();
        return true;
    }
    generar();
    return false;
}
function claveActual(){
    return clave;
}


module.exports = { claveActual, generar, comprobar};
