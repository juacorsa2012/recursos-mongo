const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt  = require('bcryptjs')
const message = require('../utils/message')

const ROL_ADMIN = 'admin'
const ROL_USER = 'usuario'

const usuarioSchema = new mongoose.Schema(
{
    nombre: {
        type: String,
        required: [true, message.NOMBRE_REQUERIDO],      
        trim: true
    },
    
    email: {
        type: String,
        required: [true, message.EMAIL_REQUERIDO],      
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, message.EMAIL_NO_VALIDO]
    },

    password: {
        type: String,
        required: [true, message.EMAIL_REQUERIDO],             
        minlength: [8, message.EMAIL_NO_VALIDO],
        select: false
    },

    rol: {
        type: String,
        enum: [ROL_ADMIN, ROL_USER],
        default: ROL_USER
    },   
    
    created_at: {
        type: Date,
        default: Date.now(),
        select: false
    }
})

usuarioSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10)
})

usuarioSchema.methods.esPasswordCorrecto = async function(bodyPassword, userPassword) {
    return await bcrypt.compare(bodyPassword, userPassword)
}

const Usuario = mongoose.model('Usuario', usuarioSchema, 'usuarios')

module.exports = Usuario