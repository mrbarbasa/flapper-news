// Models
// These models must be registered before the var routes line.
require('./models/Posts');
require('./models/Comments');
require('mongoose').connect('mongodb://localhost/news');

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// All environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// Development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Routes
app.get('/', routes.index);
app.get('/users', user.list);

// Post routes
app.get('/posts', routes.read);
app.post('/posts', routes.create);
// Retrieves post object from db and attaches it to req.post
app.param('post', routes.load);
app.get('/posts/:post', routes.retrieve);
app.put('/posts/:post/upvote', routes.upvote);

// Comment routes
app.post('/posts/:post/comments', routes.commCreate);
app.param('comment', routes.commLoad);
app.get('/posts/:post/:comment', routes.commRetrieve);
app.put('/posts/:post/:comment/upvote', routes.commUpvote);

// Initiate server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
