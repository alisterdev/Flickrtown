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


var Flickr = require("flickrapi"),
    flickrOptions = {
      api_key: "ebd88a37617f947edcbe35c153c7179a",
      secret: "f6b24a5974345704"
    };
 
Flickr.tokenOnly(flickrOptions, function(error, flickr) {
  // we can now use "flickr" as our API object,
  // but we can only call public methods and access public data
  console.log(flickr);
});


// Index
router.get('/', function(req, res) {
  
  res.render('index', {data: result});


});

module.exports = router;

