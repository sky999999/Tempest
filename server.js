var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

require('./sockets.js').listen(port);
