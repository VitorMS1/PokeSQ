module.exports = app => {
    app.route('/folders')
        .all(app.middlewares.passport.authenticate())
        .post(app.controllers.folderController.save)
        .get(app.controllers.folderController.getWithPath)

    app.route('/folders/tree')
        .all(app.middlewares.passport.authenticate())
        .get(app.controllers.folderController.getTree)

    app.route('/teams/folders/:id')
        .all(app.middlewares.passport.authenticate())
        // .get(app.api.folders.getById)
        .put(app.controllers.folderController.save)
        .delete(app.controllers.folderController.remove)
}