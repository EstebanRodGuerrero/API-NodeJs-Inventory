const { request , response } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');


// TODO ESTO: **Seguridad** - Asegurar que la persona que esta haciendo modificaciones este logeado (con su token respectivo) - Sea un ADMIN
const validarJWT = async ( req = request, res = response , next ) => {

    const token = req.header('x-token'); // Establecemos un header que tendrá que venir en la peticion HTTP

    // Aseguramos que exista un token (Metodo de seguridad). Cambia cada vez que el usuario se logea
        if( !token ) {
            return res.status(401).json({
                msg: 'No hay un token en la peticion'
            });
        }

        try {
            
            const { uid } = jwt.verify( token , process.env.SECRETORPRIVATEKEY );
            const usuario = await Usuario.findById( uid )

            // Leer el usuario que está logeado    
                if ( !usuario ) {
                    return res.status(401).json({
                        msg: 'Token no valido - El usuario no existe en la BD'
                    })
                }


            // Verificar si el usuario logeado está activo o no
                if ( !usuario.estado ) {
                    return res.status(401).json({
                        msg: 'Token no valido - Este usuario esta desactivado - Tiene estado: false'
                    })
                }


            req.usuario = usuario; // Almecenamos usuario en un req, para que este pueda ser leido desde el controlador en el que se utiliza la función.

            next();

        } catch (error) {

            console.log(error);
            res.status(401).json({
                msg: 'Token no válido'
            })

        }

}

module.exports = {
    validarJWT
}