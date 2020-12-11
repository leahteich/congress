var express = require('express');
var fs = require('fs');
var favicon = require('serve-favicon');

var app = express();
var methodOverride = require('method-override');

app.use(methodOverride('_method'));
app.use(express.urlencoded());

app.use(require('./controllers/user'));

app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/public/images/favicon.ico'));

var port = process.env.PORT || 3000; //||8000
app.listen(port, function(){
  console.log('Easy server listening for requests on port '+ port+'!');
});

app.get('/', function(request, response){
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('index',{feedback:""});

});

app.get('/index', function(request, response){
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('index',{feedback:""});

});

app.get('/login', function(request, response){
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('login',{feedback:""});
});

//app.get('/user_details', function(request, response){
//  response.status(200);
 // response.setHeader('Content-Type', 'text/html')
  //response.render('user_details',{feedback:""});
//});

app.get('/about', function(request, response){
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('about',{feedback:""});
});
