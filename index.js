const express = require('express');
const app = express();
const port = (process.env.PORT || 3000);
var path = require('path');
var bodyParser = require('body-parser')
var sha512 = require('js-sha512');
var mongoose = require('mongoose');
var url = 'mongodb://user:1qw23e@ds143474.mlab.com:43474/fzain'
var frame_lnk = '<iframe width="450" height="260" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/<chanelID>/charts/1?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15"></iframe>   <iframe width="450" height="260" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/<chanelID>/charts/2?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15"></iframe>   <iframe width="450" height="260" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/<chanelID>/charts/3?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15"></iframe>   <iframe width="450" height="260" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/<chanelID>/charts/4?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15"></iframe>'
var f1 = '<iframe width="450" height="260" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/<chanelID>/charts/1?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15"></iframe>'
var f2 = '<iframe width="450" height="260" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/<chanelID>/charts/2?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15"></iframe>'
var f3 = '<iframe width="450" height="260" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/<chanelID>/charts/3?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15"></iframe>'
var f4 = '<iframe width="450" height="260" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/<chanelID>/charts/4?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15"></iframe>'
var fs = require('fs');
var jwt = require('jsonwebtoken');
mongoose.connect(url , { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var user = new mongoose.Schema({
  // username:{type:String , require:true , unique:true , default:'iluay'},
  password:{type:String , require:true , default:'iluay'},
  // email:{type:String , require:true , default:'iluay' , unique:true},
  names:{type:String , require:true , default:'iluay'},
  names2:{type:String , require:true , default:'iluay'},
  names3:{type:String , require:true , default:'iluay'},
  gp_name:{type:String , require:true , default:'iluay' , unique:true},
  frame:{type:String , require:true , default:'iluay'},
  chanelID:{type:String , require:true , default:'iluay'},
  ip:String
});
var user_schema = mongoose.model('fzaindb', user);
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', async function(req , res){
  console.log('presented root page to: ');
  var ip = req.ip;
  console.log(ip);
  try{
  user = await user_schema.findOne({ip:req.ip} , function(err , user)
  {
    try{
    if(err)
    {
      res.sendFile(path.join(__dirname + '/login.html'));
    }
    var index = fs.readFileSync(path.join(__dirname +'/index.html'), 'utf8');
    index = index.replace('Nima!' ,user.gp_name );
    index = index.replace('<frameHere>' , user.frame);
    index = index.replace('<member1>' , user.names);
    index = index.replace('The Best Group Ever' , user.gp_name);
    if(user.names2 != 'nomember')
    {
      index = index.replace('<member2>' , user.names2);
    }
    if(user.names3 != 'nomember')
    {
      index = index.replace('<member3>' , user.names3);
    }
    index = index.replace('<chanelIDplace>' , user.chanelID)
    res.send(index);}
    catch(err)
    {
      res.sendFile(path.join(__dirname + '/login.html'));
    }
  });}
  catch(err)
  {
    res.sendFile(path.join(__dirname + '/login.html'));
  }
  res.sendFile(path.join(__dirname + '/login.html'));
});
app.get('/signup', function(req , res){
  console.log('presented signup page to: ');
  console.log(req.ip);
  res.sendFile(path.join(__dirname + '/Signup2.html'));
});
app.get('/logout' , async function(req , res){
  await user_schema.findOneAndUpdate({ip:req.ip},{ip:'0000'});
  res.sendFile(path.join(__dirname + '/login.html'));
})
app.get('/style.css' , function(req , res){
  res.sendFile(path.join(__dirname + '/style.css'));
})
app.get('/bg.jpeg' , function(req,res){
  res.sendFile(path.join(__dirname + '/bg.jpeg'));
})
app.post('/login' , async function(req,res){
  var index_1 = fs.readFileSync(path.join(__dirname +'/login.html'), 'utf8');
  index_1 = index_1.replace('Welcome!' , 'incorrect username or password');
  var gp_name_ = req.body.groupname;
  var password_ = req.body.password;
  console.log("gp_name: " + gp_name_);
  console.log("password: " + password_ );
  try{
  result = await user_schema.findOneAndUpdate({gp_name:gp_name_ },{ip:req.ip} , function(err , result){
    if(err)
    {
      res.send(index_1);
    }
    if(result == null)
    {
      res.send(index_1);
    }
  })}
  catch(ex)
  {
    res.send(index_1);
  }
  if (typeof(result) == null)
  {
    res.send(index_1);
    return;
  }
  if(result == null)
  {
    res.send(index_1);
  }
  console.log('here global');
  console.log(result.gp_name);
  console.log(result.password);
  if (result.password == sha512(password_))
  {
    var token = jwt.sign({ id: result.gp_name },'ILUAY', {
      expiresIn: 300
    });
    var index = fs.readFileSync(path.join(__dirname +'/index.html'), 'utf8');
    index = index.replace('Nima!' , result.gp_name);
    index = index.replace('<frameHere>' , result.frame);
    index = index.replace('<member1>' , result.names);
    index = index.replace('The Best Group Ever' , result.gp_name);
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
app.post('/signup' , async function(req,res){
  console.log('Signing up');
  var names_ = req.body.member1;
  var names2_ = req.body.member2;
  var names3_ = req.body.member3;
  var password_ = req.body.password;
  // var email_ = req.body.email;
  var gp_name_ = req.body.groupName;
  // var username_ = req.body.username;
  // var frame_ = req.body.channelId;
  frame_ = f1.replace("<chanelID>" , req.body.channelId) + f2.replace("<chanelID>" , req.body.channelId) + f3.replace("<chanelID>" , req.body.channelId) + f4.replace("<chanelID>" , req.body.channelId);
  // frame_ = frame_lnk.replace("<chanelID>" , frame_);
  password_ = sha512(password_);
  // console.log("name: " + names_);
  // console.log("username: " + username_);
  // console.log("password: " + password_);
  var new_user = new user_schema({
    names:names_,
    names2:names2_,
    names3:names3_,
    password:password_,
    // email:"iluay",
    gp_name:gp_name_,
    // username:"iluay",
    frame:frame_,
    chanelID:req.body.channelId
  });
  await new_user.save(function(err)
  {
    if(err)
      {
        console.log('failed saving user')
        console.log(err);
        res.send('filed creating user')
      }
    else
      {
        console.log('user created')
        res.sendFile(path.join(__dirname + '/login.html'));
      }
  });
});

app.listen(port, () => console.log(`app listening on port ${port}!`));
