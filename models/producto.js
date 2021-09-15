const { Schema , model } = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [ true , 'El rol es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        require: true
    },
    precio: {
        type: Number,
        defaut: 0
    },
    img: {
        type: String
    },
    descripcion: { type: String , required: true },
    disponible: { type: Boolean , default: true }
});

module.exports = model( 'Producto' , ProductoSchema );