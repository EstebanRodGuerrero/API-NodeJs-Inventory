const { response , request } = require('express');

const Producto = require('../models/producto');


    // CREAR
    const crearProducto = async( req , res = response ) => {

        const { _id , usuario , ...resto } = req.body;
        const nombre = resto.nombre.toUpperCase();

        const productoDB = await Producto.findOne({ nombre });

        if ( productoDB ) { 
            return res.status(400).json({
                msg: `El producto ${ productoDB.nombre } ya existe`
            })
        }


        // Generar la data a guardar
        const data = {
            ...resto,
            nombre,
            usuario : req.usuario._id
        }


        // Creo un modelo de Producto con la data que quiero grabar
        const producto = new Producto( data );


        // Guarda Producto en DB
        await producto.save();


        // Enviar

        res.status(201).json( producto );

    }

    // OBTENER 1 
    const obtenerProducto = async ( req , res ) => {
        const { id } = req.params;
        const producto = await Producto.findById( id ).populate( 'usuario' , 'nombre' );

        res.json({
            msg: 'obtenerProducto exitoso !',
            producto
        })
    }

    // OBTENER *
    const obtenerProductos = async ( req , res ) => {
        const estadoActivo = { estado: true };
        const [ total , productos ] = await Promise.all([
            Producto.countDocuments( estadoActivo ),
            Producto.find( estadoActivo )
                .populate('usuario' , 'nombre')
        ]);

        res.json({
            msg: 'obtenerProductos exitoso',
            total,
            productos
        });
    }

    // ACTUALIZAR
    const actualizarProducto = async ( req , res ) => {

        const { id } = req.params;
        const { _id , usuario , ...resto } = req.body;

        resto.nombre = resto.nombre.toUpperCase();
        resto.usuario = req.usuario._id;

        const producto = await Producto.findByIdAndUpdate( id , resto , { new: true } );

        res.json({
            msg: 'actualizarProducto exitoso',
            producto
        })

    }

    // BORRAR
    const borrarProducto = async ( req , res ) => {
        
        const { id } = req.params;
        const producto = await Producto.findByIdAndUpdate( id , { estado: false } , { new: true } );

        res.json({
            msg:'borrarProducto exitoso',
            producto
        });
    }

module.exports = {
    crearProducto,
    obtenerProducto,
    obtenerProductos,
    actualizarProducto,
    borrarProducto
}