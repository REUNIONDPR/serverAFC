const express = require('express');
const router = express.Router();
//   const users = require("../controllers/user.controller.js");
const pool = require('../config/db.config');

//profile
router.post('/test', (request, res) => { console.log(request.body) });

router.get('/search', (request, response) => {
  console.log(request.query)
  let sql = `SELECT * FROM user WHERE idgasi like '%${request.query.d}%' `;
  //   let io = request.app.get("io");
  pool.getConnection(function (error, conn) {
    if (error) throw err; // not connected!

    conn.query(sql, (err, result) => {
      // When done with the connection, release it.
      conn.release();

      // Handle error after the release.
      if (err) {
        console.log(err.sqlMessage)
        return response.status(500).json({
          err: "true",
          error: err.message,
          errno: err.errno,
          sql: err.sql,
        });
      } else {
        // io.emit("someEvent", result);
        response.status(201).json(result)
      }

      // Don't use the connection here, it has been returned to the pool.
    });
  });

});
//   router.post("/user/test", () => {console.log("aze")});
//     // Create a new Tutorial
//     router.post("/user/", users.create);

//     // Retrieve all Tutorials
//     router.get("/user/", users.findAll);

//     // Retrieve a single Tutorial with id
//     router.get("/user/:id", users.findOne);

//     app.use('/api/users', router);

module.exports = router;

