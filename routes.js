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

  var query = "montreal skyline";

  if (req.query.city) {
    query = req.query.city + " skyline";
  }

  var Flickr = require("flickrapi"),
  flickrOptions = {
    api_key: "ebd88a37617f947edcbe35c153c7179a",
    secret: "f6b24a5974345704"
  };

  Flickr.tokenOnly(flickrOptions, function(error, flickr) {
// we can now use "flickr" as our API object,
// but we can only call public methods and access public data

flickr.groups.search({
  text: query
}, function(err, result) {
  var randomGroup = Math.floor((Math.random() * result.groups.group.length));
  var groupID = result.groups.group[randomGroup].nsid;

  flickr.groups.pools.getPhotos({
    group_id: groupID
  }, function (err, result){
    var obj = result.photos.photo;
    var imgArray = [];

    for(var i = 0; i < obj.length; i++) {          
      var farm = obj[i].farm;
      var server_id = obj[i].server;
      var id = obj[i].id;
      var secret = obj[i].secret;


      var title = obj[i].title;
      var imgSm = "https://farm" + farm + ".staticflickr.com/" + server_id + "/" + id + "_" + secret + "_n.jpg";
      var imgLg = "https://farm" + farm + ".staticflickr.com/" + server_id + "/" + id + "_" + secret + "_b.jpg";

      imgArray[i] = {title: obj[i].title, imgSm: imgSm, imgLg:imgLg};
    }
    res.render('index', {data: imgArray}); 
  });
});
});
});

module.exports = router;

