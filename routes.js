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
  
  var Flickr = require("flickrapi"),
    flickrOptions = {
      api_key: "ebd88a37617f947edcbe35c153c7179a",
      secret: "f6b24a5974345704"
    };
 
    Flickr.tokenOnly(flickrOptions, function(error, flickr) {
      // we can now use "flickr" as our API object,
      // but we can only call public methods and access public data

      flickr.photos.search({
        text: "montreal"
      }, function(err, result) {

        //https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
        var obj = result.photos.photo;
        console.log(obj.length);
        for(var i = 0; i < obj.length; i++) {          
          var farm = obj[i].farm;
          var server_id = obj[i].server;
          var id = obj[i].id;
          var secret = obj[i].secret;
          var title = obj[i].title;

          var img-sm = "https://farm" + farm + ".staticflickr.com/" + server_id + "/" + id + "_" + secret + "_n.jpg";
          var img-lg = "https://farm" + farm + ".staticflickr.com/" + server_id + "/" + id + "_" + secret + "_b.jpg";

          console.log(url);
     

        }

        res.render('index', {data: result.photos.photo});          
      });

      
    });
});

module.exports = router;

