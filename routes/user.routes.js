const express = require('express');
const router = express.Router();
//   const users = require("../controllers/user.controller.js");
const pool = require('../config/db.config');

//profile
router.post('/test', (request, res) => { console.log(request.body) });


//   router.post("/user/test", () => {console.log("aze")});
//     // Create a new Tutorial
//     router.post("/user/", users.create);

//     // Retrieve all Tutorials
//     router.get("/user/", users.findAll);

//     // Retrieve a single Tutorial with id
//     router.get("/user/:id", users.findOne);

//     app.use('/api/users', router);

module.exports = router;

