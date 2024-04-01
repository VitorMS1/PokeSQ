module.exports = app => {
    app.route('/favorites')
        .all(app.middlewares.passport.authenticate())
        .post(app.controllers.favoriteController.save)
        .get(app.controllers.favoriteController.get)
        .delete(app.controllers.favoriteController.remove)
}