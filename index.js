//imports http library and express
var http = require('http'),
    express = require('express'),
    path = require('path');
//creates an express instance
var app = express();
//sets the apps server port to 3000
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req,res){
  res.send('<html><body><h1>Ski Places Endpoint</h1></body></html>');
});

//creates a server on port 3000
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express Server listening on port: " + app.get('port'));
});
