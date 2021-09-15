const { response , request } = require('express');

const Categoria = require('../models/categoria');



    // Crear Categoria
    const crearCategoria = async( req , res = response ) => {

        const nombre = req.body.nombre.toUpperCase(); // Siempre en mayuscula: Para que los usuario no puedan crear una categoria con el mismo nombre NUNCA.

        const categoriaDB = await Categoria.findOne({ nombre });

        if ( categoriaDB ) { 
            return res.status(400).json({
                msg: `La categoria ${ categoriaDB.nombre } ya existe`
            })
        }


        // Generar la data a guardar
        const data = {
            nombre,
            usuario : req.usuario._id
        }


        // Creo un modelo de Categoria con la data que quiero grabar
        const categoria = new Categoria( data );


        // Guarda Categoria en DB
        await categoria.save();



        res.status(201).json({
            categoria
        });

    }



    // obtenerCategorias - paginado - total - populate *validar
    const obtenerCategorias = async ( req = request , res = response ) => {

        const estadoActivo = { estado: true };

        const [ total , categorias ] = await Promise.all([
            Categoria.countDocuments( estadoActivo ),
            Categoria.find( estadoActivo )
                .populate('usuario' , 'nombre')
        ]);

        
        res.json({
            msg: 'obtenerCategorias exitoso',
            total,
            categorias
        });

    }


    // obtenerCategoria - populate {} *validar
    const obtenerCategoria = async ( req = request , res = response ) => {

        const { id } = req.params;
        const categoria = await Categoria.findById( id ).populate( 'usuario' , 'nombre' );

        
        res.json({
            msg: 'obtenerCategoria exitoso !',
            categoria
        })

    }


    // actualizarCategoria *validar
    const actualizarCategoria = async ( req = request , res = response ) => {

        const { id } = req.params;
        const { _id , usuario , ...resto } = req.body;

        resto.nombre = resto.nombre.toUpperCase();
        resto.usuario = req.usuario._id;

        const categoria = await Categoria.findByIdAndUpdate( id , resto , {new: true} ); // OPCION: {new: true} para enviar el nuevo objeto y mostrarlo

        res.json({
            msg: 'actualizarCategoria exitoso !',
            categoria
        })

    }

    // borrarCategoria - estado : false *validar
    const borrarCategoria = async ( req = request , res = response ) => {

        const { id } = req.params;

        // Cambiamos el estado de la categoria (no recomendable eliminar del todo)
        const categoria = await Categoria.findByIdAndUpdate( id , { estado: false } , { new: true } );

        // Ver que usuario esta autenticado
        //const usuarioAutenticado = req.usuario;


        res.json({
            msg: 'borrarCategoria exitoso !',
            categoria,
            //usuarioAutenticado
        });

    }

    /**
     * Cosas que me faltaron : 
     *      - toUpperCase al nombre de la categoria al ACTUALIZAR.
     */

module.exports = {
    crearCategoria,
    obtenerCategoria,
    obtenerCategorias,
    actualizarCategoria,
    borrarCategoria
}