const express = require('express');
const app = express();
const port = 3000;
var path = require('path');
var bodyParser = require('body-parser')
var sha512 = require('js-sha512');
var mongoose = require('mongoose');
var url = 'mongodb://user:1qw23e@ds143474.mlab.com:43474/fzain'
mongoose.connect(url);
mongoose.Promise = global.Promise;
var user = new mongoose.Schema({
  username:{type:String , require:true , unique:true},
  password:{type:String , require:true},
  email:{type:String , require:true , unique:true},
  names:{type:String , require:true},
  gp_name:{type:String , require:true},
  frame:{type:String , require:true}
});
var user_schema = mongoose.model('user_schema', user);
user.auth = function(gp_name_ , password_)
{
  console.log(this);
  usr = this.where({gp_name: new RegExp(gp_name_ , 'i')});
  if (usr.password == sha512(password_))
  {
    return usr.frame;
  }
  else
  {
    return 'incorrect password';
  }
};
// const mongo = require('mongodb').MongoClient
// const url = 'mongodb://akbar:Akbar30bill@ds143474.mlab.com:43474/fzain'
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(bodyParser.urlencoded());     // to support URL-encoded bodies
// mongo.connect(url, (err, client) => {
//   if (err) {
//     console.error(err)
//     return
//   }
//   else{
//     client.createUser(username , password);
//   }
// });

app.get('/', function(req , res){
  console.log('presented root page to: ');
  console.log(req.ip);
  res.sendFile(path.join(__dirname + '/login.html'));
});
app.get('/signup', function(req , res){
  console.log('presented signup page to: ');
  console.log(req.ip);
  res.sendFile(path.join(__dirname + '/Signup2.html'));
});
app.post('/login' ,async function(req,res){
  var gp_name_ = req.body.groupname;
  var password_ = req.body.password;
  console.log("username: " + gp_name_);
  console.log("password: " + password_ );
  result = await user_schema.findOne({gp_name:gp_name_});
  console.log(result.gp_name);
  console.log(result.password);
  if (result.password == sha512(password_))
  {
    res.send(result.frame)
  }
  else
  {
    res.send('login failed')
  }
});

app.post('/signup' , function(req,res){
  console.log('Signing up');
  // var names_ = req.body.name;
  var names_ = 'nun';
  var password_ = req.body.password;
  var email_ = req.body.email;
  var gp_name_ = req.body.groupName;
  var username_ = req.body.username;
  var frame_ = req.body.channelId;
  password_ = sha512(password_);
  console.log("name: " + names_);
  console.log("username: " + username_);
  console.log("password: " + password_);
  var new_user = new user_schema({
    names:names_,
    password:password_,
    email:email_,
    gp_name:gp_name_,
    username:username_,
    frame:frame_
  });
  new_user.save(function(err)
  {
    if(err)
      {
        console.log('failed saving user')
        res.send('filed creating user')
      }
    else
      {
        console.log('user created')
        res.send('user created')
      }
  });
});

app.listen(port, () => console.log(`app listening on port ${port}!`));
