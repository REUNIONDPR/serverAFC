// const db = require("../models");
// const User = db.user;
// const Op = db.Sequelize.Op;

// // Create and Save a new Tutorial
// exports.create = (req, res) => {
//     // Validate request
//     if (!req.body.idgasi) {
//             res.status(400).send({
//             message: "Content can not be empty!"
//         });
//         return;
//     }

//     // // Create a Tutorial
//     const user = {
//         idgsai: req.body.idgasi,
//         nom: req.body.nom,
//         prenom: req.body.prenom,
//         fonction: req.body.fonction
//     };

//     // Save Tutorial in the database
//     User.create(user)
//         .then(data => {
//             res.send(data);
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).send({
//                 message:
//                 err.message || "Some error occurred while creating the Tutorial."
//             });
//         });
// }

// // Retrieve all Tutorials from the database.
// exports.findAll = (req, res) => {
//     const idgasi = req.query.idgasi;
//     var condition = idgasi ? { idgasi: { [Op.like]: `%${idgasi}%` } } : null;

//     User.findAll({ where: condition })
//         .then(data => {
//             res.send(data);
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message:
//                 err.message || "Some error occurred while retrieving users."
//             });
//         });
// };

// // Find a single Tutorial with an id
// exports.findOne = (req, res) => {
//     const id = req.params.id;

//     User.findByPk(id)
//         .then(data => {
//             res.send(data);
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message: "Error retrieving User with id=" + id
//             });
//         });
// };