const bcrypt = require("bcrypt-nodejs");

module.exports = app => {
    const { existsOrError, notExistOrError, equalsOrError, emailValidator } = app.controllers.validator
    const User = app.models.user

    const encryptPassword = (password) => {
        try {
            const salt = bcrypt.genSaltSync(10)
            return bcrypt.hashSync(password, salt)
        } catch (error) { throw error }
    }

    const UserController = {

        async save(req, res) {
            const user = { ...req.body }
            if (req.params.id) user.userId = req.user.id
            try {
                existsOrError(user.userName, 'Nome não informado');
                existsOrError(user.email, 'E-mail não informado')
                existsOrError(user.password, 'Senha não informada')
                existsOrError(user.confirmPassword, 'Confirme sua senha')
                equalsOrError(user.password, user.confirmPassword, 'As senhas se diferem')
                emailValidator(user.email, 'E-mail inválido')
                delete user.confirmPassword

                if (!user.userId || user.userId === '') {
                    const userFromDB = await User.getByEmail(user.email)
                    notExistOrError(userFromDB, 'Esse e-mail já foi cadastrado')
                }
            }
            catch (msg) { return res.status(400).send({ erro: msg }) }

            user.password = encryptPassword(user.password)

            try {
                if (user.userId) {
                    const updatedUser = await User.updateUser(user);
                    if (updatedUser) {
                        res.sendStatus(200)
                    }
                    else {
                        res.status(404).send({ erro: 'Usuário não encontrado.' })
                    }
                }
                else {
                    const createdUser = await User.createUser(user);
                    res.status(201).send(createdUser)
                }
            } catch (msg) { return res.status(500).send({ erro: msg }) }
        },

        async getById(req, res) {
            try {
                const user = await User.getById(req.user.id);
                if (user) {
                    res.status(200).send(user)
                } else {
                    res.status(404).send({ erro: 'Usuário não encontrado.' })
                }
            } catch (error) {
                res.status(500).send({ erro: error })
            }
        },

        async removeUser(req, res) {
            try {
                const user = await User.remove(req.user.id);
                if (user) {
                    res.sendStatus(200)
                } else {
                    res.status(404).send({ erro: 'Usuário não encontrado.' })
                }
            } catch (error) {
                res.status(500).send({ erro: error })
            }
        }
    }

    return UserController;
}

