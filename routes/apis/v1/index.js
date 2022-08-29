var express = require('express');
var router = express.Router();
module.exports = router;

/**
 *  base:   clave ACCESO/apis/v1/
 */
router.all('/', ()=>0)                              //raiz deja colgada en todos los métodos
router.use('/dashboard/', require('./dashboard'));
