const { Router } = require('express'); // Extraimos una funcion de express llamada Router

const { buscar } = require('../controllers/buscar-controller');




const router = Router();


    router.get( '/:coleccion/:termino' , buscar );


module.exports = router;