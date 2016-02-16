//imports http, express, path
var http = require('http'),
    express = require('express'),
    path = require('path'),
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    CollectionDriver = require('./collectionDriver.js').CollectionDriver;
//creates an express instance
var app = express();
//sets the apps server port to 3000
app.set('port', process.env.PORT || 3000);
//specifies where the view templates live
app.set('views', path.join(__dirname, 'views'));
//sets jade as the templating engine
app.set('view engine', 'jade');

var collectionDriver;
var url = 'mongodb://localhost:27017/skiPlaces';
MongoClient.connect(url, function(err, db){
  console.log("connected correctly to the server");
  collectionDriver = new CollectionDriver(db);
});
//tells express to use the middleware express.static to serve up static files in response to incoming requests
app.use(express.static(path.join(__dirname, 'public')));


app.get('/:collection', function(req,res){
  var params = req.params;
  collectionDriver.findAll(req.params.collection, function(error, objs){
    if(error){ res.send(400, error);}
      else {
        if (req.accepts('html')){
          res.render('data', {objects: objs, collection: req.params.collection});
        } else {
          res.set('Content-Type', 'application/json');
          res.send(200, objs);
        }
      }
     });
});

//gets a single object
app.get('/:collection/:entity', function(req,res){
  var params = req.params;
  var entity = params.entity;
  var collection = params.collection;
  if(entity){
    collectionDriver.get(collection, entity, function(error, objs){
      if(error){res.send(400, error);}
      else {res.send(200, objs);}
    });
  } else {
    res.send(400, {error: 'bad url', url: req.url});
  }
});

app.use(function(req,res){
  res.render('404', {url:req.url});
})
//creates a server on port 3000
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express Server listening on port: " + app.get('port'));
});
