var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = require('../Models/User');
var VerifyToken = require('./VerifyToken')

router.post('/', (req, res) => {
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  User.create(
    {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    },
    (err, user) => {
      if (err)
        return res
          .status(500)
          .send('There was a problem adding the information to the database.');

      // create token
      var token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400
      });

      //   res.status(200).send(user);
      res.status(200).send({ user, auth: true, token: token });
    }
  );
});

router.get('/', function(req, res) {
  User.find({}, function(err, users) {
    if (err)
      return res.status(500).send('There was a problem finding the users.');
    res.status(200).send(users);
  });
});

// router.get('/:id', function(req, res) {
//   User.findById(req.params.id, function(err, user) {
//     if (err)
//       return res.status(500).send('There was a problem finding the user.');
//     if (!user) return res.status(404).send('No user found.');
//     res.status(200).send(user);
//   });
// });

// ...
router.get('/me', VerifyToken, function (req, res, next) {
    User.findById(req.userId, { password: 0 }, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");

        res.status(200).send(user);
    });
});

router.delete('/:id', function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if (err)
      return res.status(500).send('There was a problem deleting the user.');
    res.status(200).send('User ' + user.name + ' was deleted.');
  });
});

router.put('/:id', function(req, res) {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true }, function(
    err,
    user
  ) {
    if (err)
      return res.status(500).send('There was a problem updating the user.');
    res.status(200).send(user);
  });
});

router.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid)
      return res.status(401).send({ auth: false, token: null });
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({ auth: true, token: token });
  });
});


module.exports = router;
