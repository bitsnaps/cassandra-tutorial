var express = require('express');
var router = express.Router();
var Cassandra = require('cassandra-driver');

var client = new Cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1'
});
client.connect(function (err, result) {
  console.log('Cassandra connected: users');
});

var getAllUsers = 'SELECT * FROM shoutapp.users;';

/* GET users listing. */
router.get('/', function(req, res, next) {
  client.execute(getAllUsers, [], function (err, result) {
    if (err){
      res.status(404).send({msg: err});
    } else {
      // res.json(result);
      res.render('users', {
        users: result.rows
      });
    }
  });

});

module.exports = router;
