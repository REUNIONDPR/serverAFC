const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
require('dotenv').config();
// const connection = require('./db');
const app = express();
const port = process.env.PORT;

// ajout de socket.io
const server = require('http').Server(app)
const io = require('socket.io')(server)
require("./routes/tutorial.routes")(app);

const myCookie = 'IRLE5360';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// connection.connect((err) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log('You are connected to the database successfully');
//     }
//   });

  
// const db = require('db')
// db.connect({
//   host: process.env.DB_HOST,
//   username: process.env.DB_USER,
//   password: process.env.DB_PASS
// })
// console.log(process.env);
app.get('/', function (req, res) {
  res.sendFile('index.html', { root: __dirname })
})

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Expreszezs' });
});

app.post('/api/world', (req, res) => {
  console.log(req.body.post);
  io.emit("sms", req.body.post);
  // res.send(
  //   `I received your POST request. This is what you sent me: ${req.body.post}`,
  // );
});
let interval;
// établissement de la connexion
io.on('connection', (socket) =>{
  console.log(`Connecté au client IRLE5360_${socket.id}`)
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
})

const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  io.emit("FromAPI", response);
};

// const db = require("./models/index");
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });
// db.sequelize.sync();

// connection.connect(function(err) {
//   if (err) throw err;
//   console.log("Connecté à la base de données MySQL!");
// });


server.listen(port, () => console.log(`Listening on port ${port}`));

// app.listen(port, () => {
//     console.log(`Listening on port ${port}`)
// });