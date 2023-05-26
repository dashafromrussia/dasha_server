const express = require('express')
const {graphqlHTTP} = require('express-graphql')
const cors = require('cors')
const schema = require('./schema')
let mysql = require('mysql');
let users = [];
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server);
app.use(cors())

let db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'TEST'
});

db.connect(function(err){
  if (err) console.log(err)
})

const createUser = (input) => {
    const id = Date.now()
    return {
        id, ...input
    }
}

var fun =async function (){
  users = [];
 var data =await new Promise((resolve, reject) => {
 db.query('SELECT * FROM users')
    .on('result', function(data){
        // Push results onto the notes array
        users.push({id:data['id'],username:data['username'],age:data['age']});
        console.log('resultt bd');
       console.log(data['username']);
    })
    .on('end', function(){
        // Only emit notes after query has been completed
       // socket.emit('initial notes', notes)
       console.log(users[0]+"enddd");
       resolve(users);
      });
  });
return data;
}

var fun1 =async function (id){

 let user = {};
 var data =await new Promise((resolve, reject) => {
 db.query(`SELECT * FROM users WHERE id=${id}`)
    .on('result', function(data){
        // Push results onto the notes array
        user ={id:data['id'],username:data['username'],age:data['age']};
        console.log('resultt bd');
       console.log(data['username']);
    })
    .on('end', function(){
        // Only emit notes after query has been completed
       // socket.emit('initial notes', notes)
       resolve(user);
      });
  });
return data;
}

let dataResp = {};
var fun2 =async function (data){
  let user = {};
  var data =await new Promise((resolve, reject) => {
    db.query("INSERT INTO users (username,age) VALUES ('" + data.username + "', '" + data.age + "')")
    .on('result', function(data){
        // Push results onto the notes array
       dataResp = data;
        console.log('resultt bd');
       console.log(data);
    })
    .on('end', function(){
        // Only emit notes after query has been completed
       // socket.emit('initial notes', notes)
       db.query(`SELECT * FROM users WHERE id=${dataResp.insertId}`)
       .on('result', function(data){
           // Push results onto the notes array
           user ={id:data['id'],username:data['username'],age:data['age']};
           console.log('resultt bd');
          console.log(data['username']);
       })
       .on('end', function(){
           // Only emit notes after query has been completed
          // socket.emit('initial notes', notes)
          resolve(user);
         });
      })
   });
 return data;
 }

const root = {
    getAllUsers: async function (){
        var result = await fun();
        return result;
    },
    getUser: async function({id}){
       var result1 = await fun1(id);
       return result1;
    },
    createUser: async function({input}){
      var result2 = fun2(input);
        return result2;
    }
}


app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema,
    rootValue: root
}))

server.listen(5000, () => console.log('server started on port 5000'))
/*let express = require('express');
let app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const {graphqlHTTP} = require('express-graphql');
const cors = require('cors');
const schema = require('./schema');
let mysql = require('mysql');
app.use(cors())
const users = [{id: 1, username: "Vasya", age: 25}];

//app.use(express.urlencoded());
let db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'TEST'
});

db.connect(function(err){
  if (err) console.log(err)
})

server.listen(3000, function () {
  console.log('node express work on 3000');
});*/
/*var arr = [];
const root = {
  getAllUsers: () => {
    return users;*/
   /* db.query('SELECT * FROM test_table')
    .on('result', function(data){
        // Push results onto the notes array
        arr.push(data);
        console.log('resultt bd');
       console.log(data);
    })
    .on('end', function(){
        // Only emit notes after query has been completed
       // socket.emit('initial notes', notes)
       return arr;
      })*/
      
 // },

//}
/*app.use('/graphql', graphqlHTTP({
  graphiql: true,
  schema,
  rootValue: root
}))*/

//сокетыыы
var arr =[];
var obg ={};

io.sockets.on('connection', function(socket){
    console.log("connected");
    socket.on('select',function(data){
      db.query('SELECT * FROM test_table')
      .on('result', function(data){
          // Push results onto the notes array
          arr.push(data);
          console.log('resultt bd');
         console.log(data);
      })
      .on('end', function(){
          // Only emit notes after query has been completed
         // socket.emit('initial notes', notes)
         socket.emit('event',arr); 
        })
    });
    // Socket has connected, increase socket count
   
    // Let all sockets know how many are connected
    io.sockets.emit('users connected', "add person");
    socket.on('emitev',function(datas){
      var name = "Vasya";
      db.query("INSERT INTO test_table (name,mess) VALUES ('" + name + "', '" + datas + "')")
            .on('result', function(data){
                // Push results onto the notes array
                obg = data;
                console.log('resultt bd');
               console.log(data);
            })
            .on('end', function(){
                // Only emit notes after query has been completed
               // socket.emit('initial notes', notes)
               io.sockets.emit('eventt',{id:obg.insertId,name:name,mess:datas});
              })
    });
    socket.on('disconnect', function() {
      
    })
 
   
})

/*app.get('/',function (req, res) {
    res.render('header');
  
});

//app.use(multer({dest:"uploads"}).single("filedata"));	
const storageConfig = multer.diskStorage({
  destination: (req, file, cb) =>{
      cb(null, "public/uploads");
  },
  filename: (req, file, cb) =>{
      cb(null, file.originalname);
  }
});
app.use(multer({storage:storageConfig}).single("filedata"));

app.post('/send',function (req, res) {
  console.log(req.body);
  console.log(req.file);
  let sql2 =" SELECT name,comment,image FROM comments1";
  let sql = "INSERT INTO comments1 (name, comment,image) VALUES ('" + req.body.name + "', '" + req.body.comment + "', '" + req.file.filename + "')"; 
  con.query(sql, function (error, result) {
    if (error) throw error;
    con.query(sql2, function (error, result1){
      if (error) throw error;
      res.json(result1);
    });
  });
});


app.post('/comments',function (req, res){
  let sql =" SELECT name,comment,image FROM comments1";
   con.query(sql, function (error, result){
      if (error) throw error;
      console.log(result);
      res.json(result);
  });
});*/