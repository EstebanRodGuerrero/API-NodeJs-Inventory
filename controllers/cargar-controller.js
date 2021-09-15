const { response, request } = require('express');
const path = require('path');
const fs   = require('fs');

const cloudinary = require('cloudinary').v2
        cloudinary.config( process.env.CLOUDINARY_URL );

const { subirArchivo } = require('../helpers');
const Producto = require('../models/producto');
const Usuario = require('../models/usuario');



    // Upload file
    const cargarArchivo = async ( req = request , res = response ) => {
    
        try {
            // Imagenes
            const ext = [ 'txt' , 'md' , 'jpg' ]
            const nombre = await subirArchivo( req.files , ext , 'Archivos' ) // Argumentos: files , extensiones que se permiten , carpeta
            res.json({ nombre })
            
        } catch ( error ) {
            res.status(400).json({ error })
        }
            
        
    }

    
    // Funcion de Actualizar Imagen para fines educativos ( Revisar la funcion de mas abajo que es la que vamos a utilizar ).
    const actualizarImagen = async ( req , res ) => {

        const { coleccion , id } = req.params;

        let modelo;

        // Validacion de existencia de Modelos a Actualizar
        switch ( coleccion ) {
            case 'usuarios':
                modelo = await Usuario.findById( id );
                if( !modelo ) {
                    return res.status(500).json({
                        msg: `No existe un Usuario con id: ${ id }`
                    });
                }    
            break;
        
            case 'productos':
                modelo = await Producto.findById( id );
                if( !modelo ) {
                    return res.status(400).json({
                        msg: `No existe un Producto con id: ${ id }`
                    });
                }
            break;
            
            default:
                return res.status(500).json({ msg: 'Se me olvido validar esto :P' });
        }
        
        // Limpiar imagenes previas
        if ( modelo.img ) {
            // Borrar la imagen del servidor
            const pathImagen = path.join( __dirname , '../uploads' ,  coleccion , modelo.img ); // Busca donde está
            if ( fs.existsSync( pathImagen ) ) {
                fs.unlinkSync( pathImagen ); 
            }
        }
        
            const nombre = await subirArchivo( req.files , undefined , coleccion )
            modelo.img = nombre;
    
            await modelo.save();
    
            res.json({ modelo })
        
    }


    // Actualizar Imagen que SI usaremos con Cloudinary
    const actualizarImagenCloudinary = async ( req , res ) => {

        const { coleccion , id } = req.params;

        let modelo;

        // Validacion de existencia de Modelos a Actualizar
        switch ( coleccion ) {
            case 'usuarios':
                modelo = await Usuario.findById( id );
                if( !modelo ) {
                    return res.status(500).json({
                        msg: `No existe un Usuario con id: ${ id }`
                    });
                }    
            break;
        
            case 'productos':
                modelo = await Producto.findById( id );
                if( !modelo ) {
                    return res.status(400).json({
                        msg: `No existe un Producto con id: ${ id }`
                    });
                }
            break;
            
            default:
                return res.status(500).json({ msg: 'Se me olvido validar esto :P' });
        }

        
        // Limpiar imágenes previas -----------
            // Ejemplo nombre img: "https://res.cloudinary.com/vicctors/image/upload/v1629751593/ts1awwinjabxkndvvz32.jpg"
         if ( modelo.img ) {
            const nombreArr = modelo.img.split('/'); // Separamos en arreglos el nombre que se guarda en modelo.img, separados por '/'
            const nombre    = nombreArr[ nombreArr.length - 1 ]; // Tomamos la ultima posicion del arreglo
            const [ image_public_id ]      = nombre.split('.') // Tomamos lo que está antes del .jpg 
            await cloudinary.uploader.destroy( image_public_id );
        }

        const { tempFilePath } = req.files.archivo // tempFilePath: Es un atributo del archivo que necesitamos.
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        modelo.img = secure_url;

        await modelo.save();


        res.json( modelo );

    }


    // Mostrar Img
    const mostrarImagen = async ( req , res ) => {

        const { coleccion , id } = req.params;

        let modelo;

        // Validacion de existencia de Modelos a Actualizar
        switch ( coleccion ) {
            case 'usuarios':
                modelo = await Usuario.findById( id );
                if( !modelo ) {
                    return res.status(500).json({
                        msg: `No existe un Usuario con id: ${ id }`
                    });
                }    
            break;
        
            case 'productos':
                modelo = await Producto.findById( id );
                if( !modelo ) {
                    return res.status(400).json({
                        msg: `No existe un Producto con id: ${ id }`
                    });
                }
            break;
            
            default:
                return res.status(500).json({ msg: 'Se me olvido validar esto :P' });
                
        }
        
        // Si existe img en el modelo
        if ( modelo.img ) {
            const pathImagen = path.join( __dirname , '../uploads' ,  coleccion , modelo.img );
            if ( fs.existsSync( pathImagen ) ) { 
                return res.sendFile( pathImagen );
            }
        }
        
        // Si no existe img aun
        const pathNoImagen = path.join( __dirname , '../assets/no-image.jpg' );
        res.sendFile( pathNoImagen );

    }



module.exports = {
    cargarArchivo,
    actualizarImagen,
    actualizarImagenCloudinary,
    mostrarImagen
}