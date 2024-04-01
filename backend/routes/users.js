module.exports = app => {
    app.post('/signup', app.controllers.userController.save)
    app.post('/signin', app.middlewares.auth.signIn)

    app.route('/users/:id')
        .all(app.middlewares.passport.authenticate())
        .put(app.controllers.userController.save)
        .get(app.controllers.userController.getById)
        .delete(app.controllers.userController.removeUser)
}

