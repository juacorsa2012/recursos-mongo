const dotenv = require('dotenv')
const app = require('./app')
const message = require('./utils/message')

dotenv.config({ path: './config/.env' })

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  console.log(`${message.SERVIDOR_CORRIENDO} ${PORT}...`)
})

exports.module = server