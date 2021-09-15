const { response , request } = require('express');



    const esAdmin = ( req = request , res = response , next ) => {

        // Validar que este middleware siempre vaya despues del validarJWT.
            if ( !req.usuario ) {
                return res.status(401).json({
                    msg: 'Se quiere verificar el rol antes de validar el token'
                });
            }

        const { rol , nombre } = req.usuario;

        // Validacion rol ADMIN
            if ( rol !== 'ADMIN_ROLE' ) {
                return res.status(401).json({
                    msg: `El usuario ${ nombre } no es ADMINISTRADOR - No puedes hacer esto.`
                });
            }

        next();

    }


    
    // Validar un grupo de roles - "Se puede usar para dar permisos a los roles que nosotros queramos."
    const tieneRol = ( ...roles ) => {
        return ( req = request , res = response , next ) => {

                                //console.log( roles , req.usuario.rol );  DEBUG!!!!

            // Validar que este middleware siempre vaya despues del validarJWT.
                if ( !req.usuario ) {
                    return res.status(401).json({
                        msg: 'Se quiere verificar el rol antes de validar el token'
                    });
                }

            // Validar roles
                if ( !roles.includes( req.usuario.rol ) ){
                    return res.json({
                        msg: `Su rol: ${ req.usuario.rol } no tiene los permisos suficientes. El servicio requiere uno de estos roles: ${ roles }`
                    });
                }

            next();

        }
    }

module.exports = {
    esAdmin,
    tieneRol
}