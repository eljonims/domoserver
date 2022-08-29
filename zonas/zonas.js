function Zona ({nombre = "", descripcion=""}={}){

    this.ultima_actualizacion= 0,
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.luz = {
        acumulado: 0,
        ultimo_cambio_estado: 0,
        estado: 0,
        logs: [],
    };
    this.presencia = {
        siguiente_puesta_a_cero: 0,
        contador_detecciones_ultima_hora: 0,            
        hora_ultimo_cambio_estado: 0,
        estado: 0,
        logs : [],
    };
    this.claridad = 0;
    this.humedad = 0;
    this.temperatura = 0;
    this.puerta = {
        estado: 0,
        ultimo_acceso: 0,
        veces_accedido: 0,
        logs : [],
    };
    this.ventana = {
        estado: 0,
        ultimo_acceso: 0,
        veces_accedido: 0,
        logs : [],
    };
    this.persiana = {
        nivel_apertura:0,
        estado: 0, // 0 reposo 1 subiendo -1 bajando
        logs : [],
    };
}

function Casa(){
    this.z1 = new Zona({nombre:"z1",descripcion:"recibidor"});
    this.z2 = new Zona({nombre:"z2",descripcion:"distribuidor"});
    this.z3 = new Zona({nombre:"z3",descripcion:"estudio"});
}

const casa = new Casa();

module.exports = casa;
