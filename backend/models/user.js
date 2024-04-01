module.exports = app => {

    class User {
        constructor() {

        }

        static getById = async (id) => {
            try {
                const user = await app.db('users')
                    .select('userId', 'userName', 'email')
                    .whereNull('deletedAt')
                    .where({ userId: id })
                    .first()
                return user
            } catch (error) { throw error }
        }

        static getByEmail = async (email) => {
            try {
                const user = await app.db('users')
                    .where({ email })
                    .first();
                return user;
            } catch (error) { throw error }
        }

        static createUser = async (user) => {
            try {
                const createdUser = await app.db('users').insert(user).returning('userId')
                await app.db('folders').insert({ foldersUserId: createdUser[0].userId })
                return 'Usuário cadastrado'
            } catch (error) { throw error }
        }

        static updateUser = async (user) => {
            try {
                const updatedUser = await app.db('users')
                    .update(user)
                    .whereNull('deletedAt')
                    .where({ userId: user.userId })
                return updatedUser
            } catch (error) { throw error; }
        }

        static remove = async (id) => {
            try {
                const rowUpdated = await app.db('users')
                    .update({ deletedAt: new Date() })
                    .where({ userId: id })
                return rowUpdated
            } catch (error) { throw error }

        }
    }

    return User
}
