module.exports = app => {
    app.route('/teams')
        .all(app.middlewares.passport.authenticate())
        .post(app.controllers.teamController.save)
        .get(app.controllers.teamController.getAll)

    app.route('/teams/:id')
        .all(app.middlewares.passport.authenticate())
        .get(app.controllers.teamController.getById)
        .put(app.controllers.teamController.save)
        .delete(app.controllers.teamController.remove)

    app.route('/teams/folders/:id')
        .all(app.middlewares.passport.authenticate())
        .get(app.controllers.teamController.get)

}