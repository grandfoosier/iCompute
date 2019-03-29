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

app.get('/scoreSheet', (req, res) => {
  DB.scoreSheet()
  .then(function (result) {
    res.status(200).send(result);
  });
});

app.post('/addMCQ', (req, res) => {
  DB.addMCQ({
    q_year: req.body.q_year,
    question: req.body.question,
    option1: req.body.option1,
    option2: req.body.option2,
    option3: req.body.option3,
    option4: req.body.option4,
    corr_op: req.body.corr_op
  });
});

app.post('/removeMCQ', (req, res) => {
  DB.removeMCQ({
    q_id: req.body.q_id
  });
});

app.get('/getGraders', (req, res) => {
  DB.getGraders()
  .then(function (result) {
    res.status(200).send(result);
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

app.post('/editGrader', (req, res) => {
  DB.editGrader({
    g_id: req.body.g_id,
    graderName: req.body.graderName
  });
});

app.post('/removeGrader', (req, res) => {
  DB.removeGrader({
    g_id: req.body.g_id
  });
});

app.post('/resetPwGrader', (req, res) => {
  var pw = req.body.graderPW;
  bcrypt.hash(pw, saltRounds, function(err, hash) {
    DB.resetPwGrader({
     g_id: req.body.g_id,
     graderPW: hash
    });
  });
});

app.get('/getTeams', (req, res) => {
  DB.getTeams()
  .then(function (result) {
    res.status(200).send(result);
  });
});

app.post('/addTeam', (req, res) => {
  var pw = req.body.teamPW;
  bcrypt.hash(pw, saltRounds, function(err, hash) {
    DB.addTeam({
      t_year: req.body.t_year,
      school: req.body.school,
      grade: req.body.grade,
      teamPW: hash
    });
  });
});

app.post('/removeTeam', (req, res) => {
  DB.removeTeam({
    t_id: req.body.t_id
  });
});

app.post('/resetPwTeam', (req, res) => {
  var pw = req.body.teamPW;
  bcrypt.hash(pw, saltRounds, function(err, hash) {
    DB.resetPwTeam({
     t_id: req.body.t_id,
     teamPW: hash
    });
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
