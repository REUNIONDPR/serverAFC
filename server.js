const express = require('express');
const bodyParser = require('body-parser');
const authRouter = require('./routes/auth.route.js');
const userRouter = require('./routes/user.routes');
const globalRouter = require('./routes/global.routes');
const catalogueRouter = require('./routes/catalogue.route');
const mailrouter = require('./routes/mail.routes');
const adresseRouter = require('./routes/adresse.routes');
const formationRouter = require('./routes/formation.routes');
const attributaireRouter = require('./routes/attributaire.routes')
const sollicitationRouter = require('./routes/sollicitation.routes');
const lotRouter = require('./routes/lot.routes');
const brsRouter = require('./routes/brs.routes');

require('dotenv').config();
require('./passport/Passport');

const pool = require('./config/db.config');
const app = express();
const port = process.env.PORT;
const server = require('http').Server(app)
const myCookie = 'IRLE5360';
const morgan = require('morgan');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
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

app.post('/api/world', (req, res) => {
  console.log(req.body);
  io.emit("sms", req.body.post);
  // res.send(
  //   `I received your POST request. This is what you sent me: ${req.body.post}`,
  // );
});

app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/global', globalRouter);
app.use('/catalogue', catalogueRouter);
app.use('/attributaire', attributaireRouter);
app.use('/adresse', adresseRouter);
app.use('/formation', formationRouter);
app.use('/lot', lotRouter);
app.use('/sollicitation', sollicitationRouter);
app.use('/mail', mailrouter);
app.use('/brs', brsRouter);
// pool.getConnection(function(err) {
//   if (err) throw err;
//   console.log("Connecté à la base de données MySQL!");
// });

server.listen(port, () => console.log(`Listening on port ${port}`));

const socket = require("socket.io");
const io = socket(server, {
  cors: {
    methods: ['GET', 'POST', 'PUT']
  }
})
app.set('io',io);

io.emit("updateCatalogue", 'result');

io.on('connection', (socket) =>{
  console.log(`Connecté au client IRLE5360_${socket.id}`)

  io.emit("etatConnection", {message:'Connecté !', severity:'success'});
  socket.on('updateCatalogue', (data) => {
    io.emit("updateRow", data)
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