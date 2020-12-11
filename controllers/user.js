var express = require('express');
var router = express.Router();
const request = require('request');

var Users = require('../models/user');

router.post('/leg', function(req, res){
  console.log("Request-post /leg");

  var u = {
    session: req.body.session,
    chamber: req.body.chamber
  };

  var reqUrl = "https://api.propublica.org/congress/v1/"+u.session+"/"+u.chamber+"/members.json";

  var options = {
      url: reqUrl,
      json: true,
      headers: {
        "X-API-Key": "6aJgKYySoFvQsmKndOCSozMMIloNWAQVU8IwjWBL"
      }
    }

    request.get(options, function(error, response, body) {
      console.error('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('members:',body.results[0].members);

      res.status(200);
      res.setHeader('Content-Type','text/html');
      res.render('leg',{members:body.results[0].members, info:u, feedback:null});

  });
});

router.get('/user/new', function(req, res){
  console.log("Request-get /user/new");

  res.status(200);
  res.setHeader('Content-Type', 'text/html');
  res.render('user_details',{user:null,feedback:null});
});

router.post('/users', function(req, res){
  console.log("Request-post /users");
  //create user with info from body
  var u = {
    name: req.body.username.trim(),
    password: req.body.password.trim(),
    firstname: req.body.firstname.trim(),
    lastname: req.body.lastname.trim()
  };

  Users.createUser(u, function(created,message){
    if(created){
      res.status(200);
      res.setHeader('Content-Type', 'text/html');
      res.render('index',{feedback:message});
    }
    else{
      res.status(200);
      res.setHeader('Content-Type', 'text/html');
      res.render('index',{user:null,feedback:message});
    }
  });
});

router.get('/users/:id/edit', function(req, res){
  console.log('Request-get /users/'+req.params.id+'/edit');

  Users.getUser(req.params.id, function(u){
    res.status(200);
    res.setHeader('Content-Type', 'text/html');
    res.render('index', {user:u,feedback:null});
  });
});

router.put('/users/:id', function(req, res){
  console.log('Request-put /user/'+req.params.id);

  var u = {
    name: req.body.username.trim(),
    password: req.body.password.trim(),
    firstname: req.body.firstname.trim(),
    lastname: req.body.lastname.trim()
  };

  Users.updateUser(req.params.id,u,"put",function(u,message){
    console.log("date updated:"+u.dateupdated);
    res.status(200);
    res.setHeader('Content-Type', 'text/html');
    res.render('index', {user:u,feedback:message});
  });
});

router.delete('/users/:id', function(req, res){
  console.log('Request-delete /user/'+req.params.id);

  Users.deleteUser(req.params.id,function(){
    res.status(200);
    res.setHeader('Content-Type', 'text/html');
    res.render('index',{feedback:"Account deleted"});
  });
});

router.get('/users/game', function(req, res){
  console.log('Request-get /users/game?user_name='+req.query.user_name+"&password="+req.query.password);
  Users.getUser(req.query.user_name, function(u){
    if(u.name=="test"){
      res.status(200);
      res.setHeader('Content-Type', 'text/html');
      res.render('index',{feedback:"Please enter a valid username"});
    }
    else if(u.password!=req.query.password){
      res.status(200);
      res.setHeader('Content-Type', 'text/html');
      res.render('index',{feedback:"Username and password don't match"});
    }
    else{
      res.status(200);
      res.setHeader('Content-Type', 'text/html');
      res.render('index',{user:u});
    }
  });
});

module.exports = router;
