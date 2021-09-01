var express = require('express');
var router = express.Router();
var Cassandra = require('cassandra-driver');

var client = new Cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1'
});
client.connect(function (err, result) {
  console.log('Cassandra connected: adduser');
});

/* Show User add form */
router.get('/', function(req, res) {
  res.render('adduser');
});

var upsertUser = 'INSERT INTO shoutapp.users (username, password, email, name) VALUES (?, ?, ?, ?)';

/* Create a user */
router.post('/', function (req, res) {
  client.execute(upsertUser, [req.body.username, req.body.password, req.body.email, req.body.name], function(err, result) {
    if (err){
      res.status(404).send({msg: err})
    } else {
      console.log('User added');
      res.redirect('/users');
    }
  })
})

module.exports = router;
