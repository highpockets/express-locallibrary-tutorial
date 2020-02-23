var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.originalUrl === '/users/cool'){
    res.send('You\'re so cool');
  }
  else{
    res.send('respond with a resource');
  }
});

module.exports = router;
