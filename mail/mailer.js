
const fetch = require('node-fetch');
const nodemailer = require("nodemailer");
const debug = require('debug')('domoserver:mailer');
const path = require('path');
const db = require(path.join(process.cwd(),'database','connection'));

const transporter = nodemailer.createTransport({
    // host: "smtp.gmail.com",
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
    //   user: 'chanejapp@gmail.com', // generated ethereal user
      user: process.env.MAILER_AUTH_USER, // generated ethereal user
    //   pass: 'baem gbkf wbhz xwyj', // generated ethereal password
      pass: process.env.MAILER_AUTH_PASS, // generated ethereal password
},
});

transporter.verify().then( ()=> {
    debug('Ready for send emails');
}).catch( (err)=>{
    debug('Err in transporter.verify:');
});

function notifyByEmail({email=process.env.MAILER_DEFAULT_TARGET, tema='aviso', texto}){
    transporter.sendMail({
        from: process.env.MAILER_FROM, // '"Nombre" direccion'sender address
        to: email,
        subject: tema, // Subject line
        text: `${texto}`, // plain text body                    
    });
    debug(`message (${tema}) sended to ${email}`);
}
function sendConnectString(texto){
   
    //fetch('https://ipinfo.io/ip')
    fetch('https://ipinfo.io/ip')
    .then(res => res.text())
    .then(ip=>{
        transporter.sendMail({
            from: process.env.MAILER_FROM, // '"Nombre" direccion'sender address
            to: process.env.MAILER_DEFAULT_TARGET,
            subject: 'enlace de conexión', //'enlace''alerta''aviso', // Subject line
            text: `http://${ip}/${texto}/apis/v1/dashboard`, // plain text body                    
        })
        .then( ()=>{debug(`message (connect) sended to ${process.env.MAILER_DEFAULT_TARGET}`)})
        .catch( (err)=>{debug(err)});
    })
    .catch((err)=>{debug(err)})
}
setInterval(()=>{
    console.log('intervalo')
    fetch('https://ipinfo.io/ip')
    .then(res => res.text())
    .then(ip=>{
        console.log(ip)
        db.get("select * from config where key = 'ip'", (err,row)=>{
            if (err){
                console.log(err);
            }
            console.log(row.value)
            if(ip && row.value !== ip){
                db.run(`update config set value = '${ip}' where key = 'ip'`,
                (err,results)=>{
                    if(!err){
                        transporter.sendMail({
                            from: process.env.MAILER_FROM, // '"Nombre" direccion'sender address
                            to: process.env.MAILER_DEFAULT_TARGET,
                            subject: `cambio de ip de ${row.value} a ${ip}`, //'enlace''alerta''aviso', // Subject line
                            text: `http://${ip}/connect`, // plain text body                    
                        })
                        .then( ()=>{debug(`message (cambio de ip) sended to ${process.env.MAILER_DEFAULT_TARGET}`)})
                        .catch( (err)=>{debug(err)});
                    }
                }
                );
                
            }
        })    
    })
    .catch((err)=>{debug(err)})
}, 10 * 60_000);
module.exports = {notifyByEmail, sendConnectString};