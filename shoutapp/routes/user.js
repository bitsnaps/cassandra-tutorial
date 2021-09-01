var express = require('express');
var router = express.Router();
var Cassandra = require('cassandra-driver');

var client = new Cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1'
});
client.connect(function (err, result) {
  console.log('Cassandra connected: user');
});

var getByUsername = 'SELECT * FROM shoutapp.users WHERE username = ?';

/* GET user by username */
router.get('/:username', function(req, res, next) {
  client.execute(getByUsername, [req.params.username], function (err, result) {
    if (err){
      res.status(404).send({msg: err});
    } else {
      res.render('user', {
        user: result.rows[0]
      });
    }
  });
});

var deleteUser = 'DELETE FROM shoutapp.users WHERE username=?';

/* Delete user by username */
router.delete('/:username', function(req, res, next) {
  client.execute(deleteUser, [req.params.username], function (err, result) {
    if (err){
      res.status(404).send({msg: err});
    } else {
      res.json(result);
    }
  });
});


module.exports = router;
