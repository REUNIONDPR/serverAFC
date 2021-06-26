const express = require('express');
const bodyParser = require('body-parser');
const authRouter = require('./routes/auth.route.js');
const userRouter = require('./routes/user.routes');
const catalogueRouter = require('./routes/catalogue.route');

// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const passportJWT      = require('passport-jwt');
// const ExtractJWT       = passportJWT.ExtractJwt;
// const JWTStrategy      = passportJWT.Strategy;
// const { cpuUsage } = require('process');

require('dotenv').config();
require('./passport/Passport');

const pool = require('./config/db.config');
const app = express();
const port = process.env.PORT;
const server = require('http').Server(app)
const myCookie = 'IRLE5360';


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
 
  // res.header('Set-Cookie','SameSite=None, Secure');
  // res.header('Cross-origin-Embedder-Policy', 'require-corp');
  // res.header('Cross-origin-Opener-Policy','same-origin');
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
 
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  
  next();
});

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: __dirname })
})

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Expreszezs' });
});

app.post('/api/test', (req, res) => {
  console.log(req.body)
});

app.post('/api/world', (req, res) => {
  console.log(req.body);
  io.emit("sms", req.body.post);
  // res.send(
  //   `I received your POST request. This is what you sent me: ${req.body.post}`,
  // );
});

app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/catalogue', catalogueRouter);

// pool.getConnection(function(err) {
//   if (err) throw err;
//   console.log("Connecté à la base de données MySQL!");
// });


server.listen(port, () => console.log(`Listening on port ${port}`));

const socket = require("socket.io");
const io = socket(server, {
  cors: {
    methods: ['GET', 'POST']
  }
})


io.on('connection', (socket) =>{
  console.log(`Connecté au client IRLE5360_${socket.id}`)
  socket.emit("etatConnection", {message:'Connecté !', severity:'success'});
  socket.on('event', (message) => {
    console.log('event emit socket')
    io.emit("eventResponse", message);
  })
  socket.on("disconnect", () => {
    io.emit("etatConnection", {message:'Déconnecté !'});
    console.log(`Déconnection du client IRLE5360_${socket.id}`);
    socket.disconnect(0);
  });
})

// app.listen(port, () => {
//     console.log(`Listening on port ${port}`)
// });