var express = require('express');
var router = express.Router();
var Cassandra = require('cassandra-driver');

var client = new Cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1'
});
client.connect(function (err, result) {
  console.log('Cassandra connected: edituser');
});

var getByUsername = 'SELECT * FROM shoutapp.users WHERE username = ?';

/* Show User edit form */
router.get('/:username', function(req, res) {
  client.execute(getByUsername, [req.params.username], function(err, result) {
    if (err){
      res.status(404).send({msg: err})
    } else {
      res.render('edituser', {user: result.rows[0]});
    }
  })

});

// You can keep that query which perform the update on that user since username is a PRIMARY KEY
var upsertUser = 'INSERT INTO shoutapp.users (password, email, name, username) VALUES (?, ?, ?, ?)';
// You can't SET username with this query since username is a PRIMARY KEY
// var upsertUser = 'UPDATE shoutapp.users SET password=?, email=?, name=? WHERE username = ?';

/* Update user */
router.post('/', function (req, res) {
  client.execute(upsertUser, [req.body.password, req.body.email, req.body.name, req.body.username], function(err, result) {
    if (err){
      res.status(404).send({msg: err})
    } else {
      console.log('User updated.');
      res.redirect('/user/'+req.body.username);
    }
  })
})

module.exports = router;
