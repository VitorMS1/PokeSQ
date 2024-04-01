const mongoose = require('mongoose')
const { dbMongo } = require('../.env')

function mongoConn() {
    mongoose.connect(dbMongo.string)
        .then(() => console.log('Conectado ao mongo.'))
        .catch(e => {
            const msg = 'ERRO: Não foi possível conectar com o MongoDB!'
            console.log('\x1b[41m%s\x1b[37m', msg, '\x1b[0m')
            console.log(e)
        })
}

const config = require('../knexfile')
const knex = require('knex')(config)
knex.migrate.latest([config])

module.exports = { mongoConn, knex }