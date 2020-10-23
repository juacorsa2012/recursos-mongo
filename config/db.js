
const mongoose = require('mongoose')
const message = require('../utils/message')

const conectarDB = () => {
 mongoose.connect(process.env.DATABASE, {
    useNewUrlParser : true,
    useCreateIndex  : true,
    useFindAndModify  : false,
    useUnifiedTopology: true
  })
  .then(() => console.log(message.CONEXION_DB_CORRECTA))
  .catch((err) => {
    console.log(`${message.CONEXION_DB_ERROR}: ${err}`)
    process.exit(1)
  })  
}

module.exports = conectarDB