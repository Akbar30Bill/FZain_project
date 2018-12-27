const express = require('express');
const app = express();
const port = 3000;
var path = require('path');
var bodyParser = require('body-parser')
var sha512 = require('js-sha512');
const mongo = require('mongodb').MongoClient
const url = 'mongodb://akbar:Akbar30bill@ds143474.mlab.com:43474/fzain'
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
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
  res.sendFile(path.join(__dirname + '/root.html'));
});
app.get('/signup', function(req , res){
  console.log('presented signup page to: ');
  console.log(req.ip);
  res.sendFile(path.join(__dirname + '/signup.html'));
});
app.post('/' , function(req,res){
  var username = req.body.username;
  var password = req.body.password
  password = sha512(password);
  console.log("username: " + username);
  console.log("password: " + password);
});

app.post('/signup' , function(req,res){
  console.log('Signing up');
  var name = req.body.name;
  var username = req.body.username;
  var password = req.body.password;
  password = sha512(password);
  console.log("name: " + name);
  console.log("username: " + username);
  console.log("password: " + password);
  mongo.connect(url, (err, client) => {
    if (err) {
      console.error(err)
      return
    }
    else{
      client.createUser(username , password);
    }
  });
});

app.listen(port, () => console.log(`app listening on port ${port}!`));
