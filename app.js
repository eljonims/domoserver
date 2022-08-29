
/** NODE_ENV se establece en el script en package.json.  Debe ser o development o production */

if (!process.env.NODE_ENV){
  throw( new Error("Variable de entorno NODE_ENV no establecida"));
}

/**
 *      REQUIRES 
 */


 require('dotenv').config();  // variables set in the .env file via `process.env.VARIABLE_NAME` syntax

const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser')()

var express = require('express');
const app = express();
module.exports = app;  // en bin/www se hace luego: var app = require('../app');

require(path.join(process.cwd(),'database','connection'));                        // database connection
const {sendConnectString, notifyByEmail} = require(path.join(process.cwd(),'mail','mailer'));    // mail 
const auth = require(path.join(process.cwd(),'authentication','clave'));          // generador de claves para acceso


notifyByEmail({texto: `Servidor iniciado: ${new Date().toLocaleString()}`});

/**
 *    APP SETTINGS 
 */

 app.set('views', [
  path.join(__dirname, 'views'),
]);

app.set('view engine', 'pug');
app.disable('x-powered-by');


/**
 *  -----------  GENERAL SETUP ---------------
 */

 app.use(logger('dev'));
 app.use((req, res, next)=>{
   
    let re = new RegExp(`^/${auth.claveActual()}/apis/v\\d+/.*$`,"i");
    if(req.url === '/connect' || req.url.match(re) || req.url === '/favicon.ico'){
      return next();
    }else{
      console.log(`PETICIÓN EXTRAÑA: ${req.url}`);
      //queda colgado
    }    
 })
 app.all('/', ()=>0);         //todos los accesos a la raiz quedan colgados
 app.all('/favicon.ico',()=>0);

 app.get('/connect', function(req, res, next){    //único acceso sin clave permitido. manda clave de un sólo uso a correo predefinido
    return sendConnectString(auth.claveActual());
 });
 app.param('clave', (req, res, next, value, name)=>{
  if(auth.comprobar(value) === true){    
    console.log(`ACCESO AUTORIZADO`)
    return next();
  }
  return; // deja colgado al cliente.
 });

 app.use('/:clave/apis/v1/', require('./routes/apis/v1/index'));  //montaje del Router con accesos permitidos
 app.use(express.json());       
 app.use(express.urlencoded({ extended: false }));
 app.use(cookieParser);


/**
 * -------------- ROUTES ----------------
 */

app.use('/apis/v1/', require('./routes/apis/v1/index'));
app.use(express.static(path.join(__dirname, 'public', 'free')));

   
app.use(function(req, res, next) {return;});