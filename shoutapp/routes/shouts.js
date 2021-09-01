var express = require('express');
var router = express.Router();

var getAllShouts = 'SELECT * FROM shoutapp.shouts;';
var getAllUsers = 'SELECT * FROM shoutapp.users;';

/* GET shouts listing. */
router.get('/', function(req, res, next) {
  var client = req.app.get('client');
  client.execute(getAllShouts, [], function (err, result) {
    if (err){
      res.status(404).send({msg: err});
    } else {
      client.execute(getAllUsers, [], function (usersErr, usersResult) {
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
  var client = req.app.get('client');
  client.execute(getUserShouts, [req.params.username], function (err, result) {
    if (err){
      res.status(404).send({msg: err});
    } else {
      client.execute(getAllUsers, [], function (usersErr, usersResult) {
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

module.exports = router;
