var express = require('express');
var router = express.Router();
var Cassandra = require('cassandra-driver');

/* Show User add form */
router.get('/', function(req, res) {
  res.render('adduser');
});

/* Create a user's shout */
router.post('/', function (req, res) {
  var id1 = Cassandra.types.uuid();
  var id2 = Cassandra.types.timeuuid();

  var queries = [
    {
    query: 'INSERT INTO shoutapp.shouts(shout_id, username, body) VALUES (?, ?, ?)',
    params: [id1, req.body.username, req.body.body]
  },
    {
    query: 'INSERT INTO shoutapp.usershouts(username, shout_id, body) VALUES (?, ?, ?)',
    params: [req.body.username, id2, req.body.body]
  },
  ];
  queryOptions = [];
  var client = req.app.get('client');
  client.batch(queries, queryOptions, function (err) {
    if (err){
      res.status(404).send({msg: err});
    } else {
      res.redirect('/shouts');
    }
  });
})

module.exports = router;
