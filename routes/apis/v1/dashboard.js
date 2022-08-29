var express = require('express');
var router = express.Router();
module.exports = router;

/**
 *  base:  /apis/v1/dashboard/
 */

const path = require('path');
const db = require(path.join(process.cwd(),'database','connection'));


router.route('/')
.get(  
    function (req, res){
        res.render('dashboard',{title: 'Panel de control'});
    }
); 