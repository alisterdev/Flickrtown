var router = require('express').Router()
  , Project = require('../models/project')
  , errorHandler = require('../utils').errorHandler
  , generateSlug = require('../utils').generateSlug;

router.get('/', function(req, res) {
  Project.find({}, function (err, data) {
    if (err) {
      errorHandler(res)(err);
    } else {
      res.send(data);
    }
  });
});

router.get('/:slug', function(req, res){
    Project.findOne({ slug: req.params.slug }, function (err, data) {
    if (err) {
      errorHandler(res)(err);
    } else {
      res.send(data);
    }
  });
});

router.post('/', function(req, res) {
    // Generate unique slug
    var slug = generateSlug();

    var project = new Project({ slug: slug });
    project.save(function(err) {
        if (err) {
            errorHandler(res)(err);
        } else {
            res.send(project);
        }
    });
});

module.exports = router;