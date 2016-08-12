module.exports = function (app) {
    app.set('view engine', 'pug');
    app.set('views', process.cwd() + '/src/client/views');
}
