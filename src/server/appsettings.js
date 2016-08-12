module.exports = function (app) {
    app.set('view engine', 'pug');
    app.set('views', process.cwd() + '/src/client/views');
    app.set('port', 8001);
    app.set('host', 'localhost');
}
