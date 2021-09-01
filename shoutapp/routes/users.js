var express = require('express');
var router = express.Router();

var getAllUsers = 'SELECT * FROM shoutapp.users;';

/* GET users listing. */
router.get('/', function(req, res, next) {
  req.app.get('client').execute(getAllUsers, [], function (err, result) {
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
