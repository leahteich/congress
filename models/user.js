var fs = require("fs");
const { GoogleSpreadsheet } = require('google-spreadsheet');
const doc = new GoogleSpreadsheet('1n8RUku2I9IQhmLshpn1usoe_ZNcX8IGg9ILOedub7CY');
var creds = require('./client_secret.json');

exports.getUser = function(user_id, callback){
  console.log("Users.getUser: "+user_id);
  var user = createBlankUser();

  getAllDatabaseRows(function(u){
    for(var i=0; i<u.length; i++){
      if(u[i].name.trim()==user_id) {
        user.name=u[i].name,
        user.password=u[i].password,
        user.gamesplayed=u[i].gamesplayed,
        user.gameswon=u[i].gameswon,
        user.gameslost=u[i].gameslost,
        user.rock=u[i].rock,
        user.paper=u[i].paper,
        user.scissors=u[i].scissors,
        user.firstname=u[i].firstname;
        user.lastname=u[i].lastname;
        user.datecreated=u[i].datecreated;
        user.dateupdated=u[i].dateupdated;
      }
    }
    callback(user);
  });
}

exports.updateUser = function(user_id,new_info,source,callback){
  console.log("Users.updateUser: "+user_id+" "+new_info);
  var d = new Date();
  exports.getUser(user_id,function(user){
    if(source=="put"){
      if(new_info.name==""||new_info.password==""||new_info.firstname==""||new_info.lastname==""){
        callback(user,"Please fill all textfields");
      }
      else{
        user["name"]=new_info["name"];
        user["password"]=new_info["password"];
        user["firstname"]=new_info["firstname"];
        user["lastname"]=new_info["lastname"];
      }
    }
    else if(source=="game"){
      if(new_info=="gamesplayed"){
        user.gamesplayed++;
      }
      if(new_info=="won!")user.gameswon++;
      if(new_info=="lost.")user.gameslost++;
      if(new_info=="rock")user.rock++;
      if(new_info=="paper")user.paper++;
      if(new_info=="scissors")user.scissors++;
    }
    doc.useServiceAccountAuth(creds, function(){
      doc.getRows(1,function(err,rows){
        for(var i=0;i<rows.length;i++){
          if(rows[i].name.toLowerCase().trim()==user_id.toLowerCase().trim()){
            rows[i].name=user.name;
            rows[i].password=user.password;
            rows[i].gamesplayed=user.gamesplayed;
            rows[i].gameswon=user.gameswon;
            rows[i].gameslost=user.gameslost;
            rows[i].paper=user.paper;
            rows[i].rock=user.rock;
            rows[i].scissors=user.scissors;
            rows[i].firstname=user.firstname;
            rows[i].lastname=user.lastname;
            rows[i].dateupdated=d;
            rows[i].save(function(){
              console.log("update saved");
              callback(user,"Account updated");
            });//end save callback
          }//end if row found
        }//end for loop
      });//end get rows callback
    });//end authorization callback
  });//end get user callback
}

exports.deleteUser= function(user_id,callback){
  console.log("Users.deleteUser: "+user_id);
  doc.useServiceAccountAuth(creds, function(){
    doc.getRows(1,function(err,rows){
      for(var i=0;i<rows.length;i++){
        if(rows[i].name==user_id){
          rows[i].del(function(){
            callback();
          });//del callback
        }//end if row found
      }//end for loop
    });//end get rows callback
  });//end authorization callback
}

exports.createUser= function(new_info,callback){
  console.log("Users.createUser: "+new_info.name);
  var d = new Date();
  if(new_info.name==""||new_info.password==""||new_info.firstname==""||new_info.lastname==""){
    callback(false,"Please fill all text fields");
  }
  else{
    exports.getUser(new_info.name,function(u){
      if (u.name!="test"){
        callback(false,"Username already taken");
      }
      else{
        var user = createBlankUser();
        user.name=new_info.name,
        user.password=new_info.password,
        user.firstname=new_info.firstname,
        user.lastname=new_info.lastname,
        user.gamesplayed=0;
        user.gameswon=0;
        user.gameslost=0;
        user.rock=0;
        user.paper=0;
        user.scissors=0;
        user.datecreated=d;
        user.dateupdated=d;

        doc.useServiceAccountAuth(creds, function (err){
          doc.addRow(1,user,function(){
            console.log("user added");
            callback(true,"Account created");
          });//end addRow callback
        });//end authorization
      }//end else (user not found)
    });//end getUser callback
  }//end else (data provided)
}

exports.allUsers=function(callback){
  console.log("Users.allUsers");
  var user_data=[];
  var user = createBlankUser();
  getAllDatabaseRows(function(rows){
    for(var i=0; i<rows.length; i++){
      user={
        name:rows[i].name,
        gamesplayed:rows[i].gamesplayed,
        gameswon:rows[i].gameswon,
        gameslost:rows[i].gameslost,
      }
      user_data.push(user);
    }
    callback(user_data);
  });
}

var getAllDatabaseRows= function(callback){
  //return fs.readFileSync(__dirname +'/../data/users.csv', 'utf8').split('\n');
  doc.useServiceAccountAuth(creds, function (err) {
    // Get all of the rows from the spreadsheet.
    doc.getRows(1, function (err, rows) {
      callback(rows);
    });
  });
}

var createBlankUser= function(){
  var user={
    name:"test",
    gamesplayed:"test",
    gameslost:"test",
    gameswon:"test",
    rock:"test",
    paper:"test",
    scissors:"test",
    password:"test",
    firstname:"test",
    lastname:"test"
  };
  return user;
};
