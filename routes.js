var router = require('express').Router()
  , Project = require('./models/project')
  , generateSlug = require('./utils').generateSlug;

// Project
router.get('/project/:slug', function(req, res){
    Project.findOne({ slug: req.params.slug }, function (err, data) {
    if (err) {
      res.render('project', { project: null });
    } else {
      res.render('project', { project: data});
    }
  });
});

// Index
router.get('/', function(req, res) {

  var flickr = new Flickr({
    api_key: "ebd88a37617f947edcbe35c153c7179a"
  });

  flickr.photos.search({
    text: "red+panda"
  }, function(err, result) {
    if(err) { throw new Error(err); }
    
    res.render('index', {data: result});

  }

    
});

module.exports = router;

