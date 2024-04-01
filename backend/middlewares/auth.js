const { authSecret } = require('../.env');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const signIn = async (req, res) => {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send('Informe o login e senha para continuar!')
        }

        const user = await app.db('users')
            .where({ email: req.body.email })
            .whereNull('deletedAt')
            .first()

        if(!user) return res.status(400).send('Usuário não encontrado.')

        const isMatch = bcrypt.compareSync(req.body.password, user.password)
        if(!isMatch) return res.status(401).send('Login ou senha incorreto(s).')

        const now = Math.floor(Date.now() / 1000)
        const payload = {
            id: user.userId,
            name: user.userName,
            email: user.email,
            iat: now,
            exp: now + (60 * 60 * 24 * 2)
        }

        res.json({...payload, token: jwt.encode(payload, authSecret)})
    }

    const tokenValidador = async (req, res) => {
        const userData = req.body || null
        try {
            if(userData){
                const token = jwt.decode(userData.token, authSecret)
                if(new Date(token.exp * 1000) > new Date()){
                    return res.send(true)
                }
            }
        } catch (error) {
            
        }

        res.send(false)
    }

    return {signIn, tokenValidador}
}