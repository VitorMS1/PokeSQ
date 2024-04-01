module.exports = app => {
    app.route('/stats')
        .all(app.middlewares.passport.authenticate())
        .get(app.controllers.statController.get)
}