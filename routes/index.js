var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

var https = require('https');

var options = {
  "method": "GET",
  "hostname": "api.imgur.com",
  "path": "/3/gallery/hot/viral/0.json",
  "headers": {
    "Authorization": "57d9de3485f6e77"
  }
};

var req = https.request(options, function (response) {
  var chunks = [];

  response.on("data", function (chunk) {
    chunks.push(chunk);
  });

  response.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.end();