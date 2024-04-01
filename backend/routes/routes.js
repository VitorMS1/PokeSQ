module.exports = app => {
    app.post('/tokenValidator', app.middlewares.auth.tokenValidador)

    // app.use('/favorites', require('./favorites'));
    // app.use('/folders', require('./folders'));
    // app.use('/stats', require('./stats'));
    // app.use('/teams', require('./teams'));
    // app.use('/users', require('./users'));
}