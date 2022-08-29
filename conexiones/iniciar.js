const debug = require('debug')('domoserver:canales-comunicacion');
const socketIo = require('socket.io');
const mqtt = require('mqtt');
const path = require('path');
const casa = require(path.join(process.cwd(),'zonas','zonas'));
var clienteMQTT;
var io;



function iniciar (webserver){    
    clienteMQTT =  mqtt.connect({
        host:       process.env.MQTT_BROKER_HOST,
        port:       process.env.MQTT_BROKER_PORT,
        clientId:   process.env.MQTT_CLIENT_ID,
        username:   process.env.MQTT_AUTH_USER,
        password:   process.env.MQTT_AUTH_PASSWORD
    });
    clienteMQTT.on("error", function(error){
        debug(`error en clienteMQTT: ${error}`)
    })
    clienteMQTT.on('connect', function(){
        debug(`conectado a broker: ${clienteMQTT.connected}`);
        clienteMQTT.subscribe('presence', function(err){
            if(!err){
                clienteMQTT.publish('presence', 'presence: domoserver');
            }
        });
        clienteMQTT.subscribe('casa/#');
        clienteMQTT.subscribe('z3/#');
    });
    //---------------------------------------------------------------------
    io = socketIo(webserver);
    io.of('/').on('connection', socket =>{
        debug('conectado socket a nsp /')
        socket.on('topic',(topic,message)=>{
            clienteMQTT.publish(topic, message);
        })

    });
    clienteMQTT.on('message', function (topic, message) {// message is Buffer
        let fecha = new Date();
        let horas = fecha.getHours();
        let minutos = fecha.getMinutes();

        if(topic == 'casa/recibidor/sensores/claridad/1/valor/$'){
            casa.z1.claridad = parseInt(message.toString(),10);
            casa.z1.luz.estado = false;
        }
        io.of('/').emit('topic',topic, message.toString());     
     
        if(topic == 'casa/recibidor/sensores/movimiento/1/valor/$' && message.toString() == '1' && casa.z1.claridad < 6  && !casa.z1.luz.estado){
            clienteMQTT.publish('casa/recibidor/actuadores/luz/1/valor/=', '1');
            casa.z1.luz.estado = true;
            setTimeout(()=>{
                clienteMQTT.publish('casa/recibidor/actuadores/luz/1/valor/=', '0');
                casa.z1.luz.estado = false;
            },7000);

        }
       // debug(`${topic}  ${message.toString()}`)
    });
}


module.exports = iniciar;
