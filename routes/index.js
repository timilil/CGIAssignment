'use strict';
const express = require('express');
const router = express.Router();
const https = require('https');
const mongodb = require('mongodb');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'Express'});
});

module.exports = router;

const options = {
  'method': 'GET',
  'hostname': 'api.imgur.com',
  'path': '/3/gallery/hot/viral/0.json',
  'headers': {
    'Authorization': '57d9de3485f6e77',
  },
};

const request = https.request(options, function(response) {
  const chunks = [];

  response.on('data', function(chunk) {
    chunks.push(chunk);
  });

  response.on('end', function() {
    const body = Buffer.concat(chunks);
    console.log(body.toString());
    const json = JSON.parse(body);
    console.log(json);

    let metaData = [
      json,
    ];

    let uri = 'mongodb://heroku_4rkwp7jj:h1lq5j1v9g265nt4eaeq5nvdcn@ds235788.mlab.com:35788/heroku_4rkwp7jj';

    mongodb.MongoClient.connect(uri, function(err, client) {
      if (err) throw err;

      let herokudb = client.db('heroku_4rkwp7jj');

      //clear old collection from heroku
      herokudb.collection('viralData').remove();
      let viral = herokudb.collection('viralData');

      viral.insert(metaData, function(err, result) {
        if (err) throw err;

        client.close(function(err) {
          if (err) throw err;
        });
      });
    });
  });
});
request.end();

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

/*Parses the text as URL encoded data and exposes the resulting object*/
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(bodyParser.json());
app.post('/', function(request, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
  const searchWord = request.body.search;
  console.log(searchWord);

  let uri = 'mongodb://heroku_4rkwp7jj:h1lq5j1v9g265nt4eaeq5nvdcn@ds235788.mlab.com:35788/heroku_4rkwp7jj';

  mongodb.MongoClient.connect(uri, function(err, client) {
    if (err) throw err;

    let herokudb = client.db('heroku_4rkwp7jj');

    let viral = herokudb.collection('viralData');
    //console.log(viral.find({"data":[0][{"id": 't6xKhdF'}]}));
    viral.find({data: [{tags: searchWord}]}).toArray(function(err, data) {
      if (err) throw err;
      console.log(data);
      data.forEach(function(doc) {
        console.log(doc);
      });

      client.close(function(err) {
        if (err) throw err;
      });
    });

  });

});

app.listen(3000);

console.log('Running at Port 3000');
