const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const DB = require('./src/DB');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/getMCQs', (req, res) => {
  DB.getMCQs()
  .then(function (result) {
    res.status(200).send(result);
  });
});

app.get('/getGraders', (req, res) => {
  DB.getGraders()
  .then(function (result) {
    res.status(200).send(result);
  });
});

app.get('/getTeams', (req, res) => {
  DB.getTeams()
  .then(function (result) {
    res.status(200).send(result);
  });
});

app.post('/createMCQ', (req, res) => {
  DB.createMCQ({
    q_year: req.body.q_year,
    question: req.body.question,
    option1: req.body.option1,
    option2: req.body.option2,
    option3: req.body.option3,
    option4: req.body.option4,
    corr_op: req.body.corr_op
  });
});

app.post('/deleteMCQ', (req, res) => {
  DB.deleteMCQ({
    q_year: req.body.q_year,
    q_id: req.body.q_id
  });
});

app.post('/addGrader', (req, res) => {
  var pw = req.body.graderPW;
  bcrypt.hash(pw, saltRounds, function(err, hash) {
    DB.addGrader({
     graderName: req.body.graderName,
     graderPW: hash
    });
  });
});

app.post('/removeGrader', (req, res) => {
  DB.removeGrader({
    g_id: req.body.g_id
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
