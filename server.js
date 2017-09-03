var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'))

app.get('/front', function (req, res) {
  res.render('page', Object.assign({},data,{"page" : "front"}));
});

app.get('/back', function (req, res) {
  res.render('page', Object.assign({},data,{"page" : "back"}));
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
