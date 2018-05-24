const server = require('./api/photos/transform'); /* switch back to ./server */

const { dev, debug } = require('./dev');

const port = process.env.PORT || 5555;

server.listen(port, _ => {
  debug ? console.log(`Listening on port: ${port}`) : null;
});
