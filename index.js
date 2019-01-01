const express = require('express');
const app = express();
const port = 3000;
var path = require('path');
var bodyParser = require('body-parser')
var sha512 = require('js-sha512');
var mongoose = require('mongoose');
var url = 'mongodb://user:1qw23e@ds143474.mlab.com:43474/fzain'
var frame_lnk = '<iframe width="450" height="260" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/<chanelID>/charts/1?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15"></iframe>'
var fs = require('fs');
mongoose.connect(url);
mongoose.Promise = global.Promise;
var user = new mongoose.Schema({
  username:{type:String , require:true , unique:true},
  password:{type:String , require:true},
  email:{type:String , require:true , unique:true},
  names:{type:String , require:true},
  names2:{type:String , require:true},
  names3:{type:String , require:true},
  gp_name:{type:String , require:true},
  frame:{type:String , require:true},
  chanelID:{type:String , require:true}
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
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(bodyParser.urlencoded());     // to support URL-encoded bodies
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
app.get('/logout' , function(req , res){
  res.sendFile(path.join(__dirname + '/login.html'));
})
app.get('/style.css' , function(req , res){
  res.sendFile(path.join(__dirname + '/style.css'));
})
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
    var index = fs.readFileSync(path.join(__dirname +'/index.html'), 'utf8');
    index = index.replace('<frameHere>' , result.frame);
    index = index.replace('<member1>' , result.names);
    if(result.names2 != 'nomember')
    {
      index = index.replace('<member2>' , result.names2);
    }
    if(result.names3 != 'nomember')
    {
      index = index.replace('<member3>' , result.names3);
    }
    index = index.replace('<chanelIDplace>' , result.chanelID)
    res.send(index);
  }
  else
  {
    res.send('login failed')
  }
});

app.post('/signup' , function(req,res){
  console.log('Signing up');
  var names_ = req.body.member1;
  var names2_ = req.body.member2;
  var names3_ = req.body.member3;
  var password_ = req.body.password;
  var email_ = req.body.email;
  var gp_name_ = req.body.groupName;
  var username_ = req.body.username;
  var frame_ = req.body.channelId;
  frame_ = frame_lnk.replace("<chanelID>" , frame_);
  password_ = sha512(password_);
  console.log("name: " + names_);
  console.log("username: " + username_);
  console.log("password: " + password_);
  var new_user = new user_schema({
    names:names_,
    names2:names2_,
    names3:names3_,
    password:password_,
    email:email_,
    gp_name:gp_name_,
    username:username_,
    frame:frame_,
    chanelID:req.body.channelId
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

// let memCount = 1;
//
// function addMemberField() {
//     if (memCount == 3) {
//         alert("There can be a maximum of 3 members in a single group!");
//         return
//     }
//     memCount++;
//     let id = "member" + memCount;
//     let elem = document.getElementById(id);
//     elem.value=""
//     elem.style.display = "inline-block";
//     document.getElementById("b"+(memCount-1)).style.display="inline-block";
// }
// function removeMemberField() {
//     if (memCount == 1) {
//         alert("Your group should have at least one member!");
//         return
//     }
//     let id = "member" + memCount;
//     let elem = document.getElementById(id);
//     elem.style.display = "none";
//     document.getElementById("b"+(memCount-1)).style.display="none";
//     memCount--;
// }
