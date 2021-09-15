

// Aquí si queremos podemos poner todos los middlewares personalizados
//  Solo con el fin de limpiar un poco el codigo


const  validarCampos = require('../middlewares/validar-campos');
const  validarJWT  = require('../middlewares/validar-jwt');
const  validarRoles = require('../middlewares/validar-roles');
const  validarArchivoSubir = require('../middlewares/validar-carga');


module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validarRoles,
    ...validarArchivoSubir
}