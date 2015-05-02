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
  
  var query = "montreal";
  if (req.query.city) {
    query = req.query.city;
  }

  var groupId = '34427471721@N01'; // MTL real city

  if (query == "New York") {
    groupId = '360904@N23';
  } else if (query == "Los Angeles") {
    groupId = '35034362087@N01';
  } else if (query == "Toronto") {
    groupId = '35034362597@N01';
  } else if (query == "London") {
    groupId = '85042296@N00';
  } else if (query == "Moscow") {
    groupId = '22761195@N00';
  }

  var Flickr = require("flickrapi"),
  flickrOptions = {
    api_key: "ebd88a37617f947edcbe35c153c7179a",
    secret: "f6b24a5974345704"
  };

  Flickr.tokenOnly(flickrOptions, function(error, flickr) {

    flickr.groups.pools.getPhotos({
        group_id: groupId
      }, function (err, result){
        var obj = result.photos.photo;
        var imgArray = [];

        for (var i = 0; i < obj.length; i++) {          
          
          var farm = obj[i].farm;
          var server_id = obj[i].server;
          var id = obj[i].id;
          var secret = obj[i].secret;

          var title = obj[i].title;
          var imgSm = "https://farm" + farm + ".staticflickr.com/" + server_id + "/" + id + "_" + secret + "_n.jpg";
          var imgLg = "https://farm" + farm + ".staticflickr.com/" + server_id + "/" + id + "_" + secret + "_b.jpg";

          imgArray[i] = {title: obj[i].title, imgSm: imgSm, imgLg:imgLg};
        }
        shuffle(imgArray);        
        res.render('index', {data: imgArray, city: req.query.city}); 

      }); // end of groups.pools.getPhotos
  });
});

module.exports = router;

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

