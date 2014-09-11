var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

exports.index = function(req, res) {
  res.render('index', { title: 'Flapper News' });
};


// Routes for Posts

exports.read = function(req, res, next) {
  Post.find(function(err, posts) {
    if (err) {
      return next(err);
    }
    res.json(posts);
  });
};

exports.create = function(req, res, next) {
  var post = new Post(req.body);

  post.save(function(err, post) {
    if (err) {
      return next(err);
    }
    res.json(post);
  });
};

exports.load = function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post) {
    if (err) {
      return next(err);
    }
    if (!post) {
      return next(new Error("can't find post"));
    }

    req.post = post;
    return next();
  });
};

exports.retrieve = function(req, res, next) {
  // Automatically loads all comments associated with the post
  req.post.populate('comments', function(err, post) {
    res.json(post);
  });
};

exports.upvote = function(req, res, next) {
  req.post.upvote(function(err, post) {
    if (err) {
      return next(err);
    }
    res.json(post);
  });
};


// Routes for Comments

exports.commCreate = function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;

  comment.save(function(err, comment){
    if (err) {
      return next(err);
    }
    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if (err) {
        return next(err);
      }
      res.json(comment);
    });
  });
};

exports.commLoad = function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, comment) {
    if (err) {
      return next(err);
    }
    if (!comment) {
      return next(new Error("can't find comment"));
    }

    req.comment = comment;
    return next();
  });
};

exports.commRetrieve = function(req, res, next) {
  res.json(req.comment);
};

exports.commUpvote = function(req, res, next) {
  req.comment.upvote(function(err, comment) {
    if (err) {
      return next(err);
    }
    res.json(comment);
  });
};