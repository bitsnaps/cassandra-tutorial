var express = require('express');
var router = express.Router();

var getAllShouts = 'SELECT * FROM shoutapp.shouts;';
var getAllUsers = 'SELECT * FROM shoutapp.users;';

/* GET shouts listing. */
router.get('/', function(req, res, next) {
  var cql = req.app.get('client');
  cql.execute(getAllShouts, [], function (err, result) {
    if (err){
      res.status(404).send({msg: err});
    } else {
      cql.execute(getAllUsers, [], function (usersErr, usersResult) {
        if (usersErr){
          res.status(404).send({msg: usersErr});
        } else {
          res.render('shouts', {
            shouts: result.rows,
            users: usersResult.rows
          });
        }
      });
    }
  });
});

var getUserShouts = 'SELECT * FROM shoutapp.usershouts WHERE username = ?;';

/* GET user's shouts */
router.get('/:username', function(req, res, next) {
  var cql = req.app.get('client');
  cql.execute(getUserShouts, [req.params.username], function (err, result) {
    if (err){
      res.status(404).send({msg: err});
    } else {
      cql.execute(getAllUsers, [], function (usersErr, usersResult) {
        if (usersErr){
          res.status(404).send({msg: usersErr});
        } else {
          res.render('shouts', {
            shouts: result.rows,
            users: usersResult.rows
          });
        }
      });
    }
  });
});

var deleteShout = 'DELETE FROM shoutapp.shouts WHERE shout_id = ?';
var deleteUserShout = 'DELETE FROM shoutapp.usershouts WHERE shout_id = ? AND username = ?';

/* Delete a shout */
router.delete('/:shoutId/:username', function (req, res, next) {
  var queries = [
    { query: deleteShout, params: [req.params.shoutId] },
    { query: deleteUserShout, params: [req.params.shoutId, req.params.username] }
  ];
  queryOptions = [];
  var cql = req.app.get('client');
  cql.batch(queries, queryOptions, function (err, result) {
    if (err){
      res.status(404).send( { info: err.info, message: err.message } );
    } else {
      res.json(result);
    }
  })
})

module.exports = router;
