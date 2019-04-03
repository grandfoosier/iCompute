const express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var cookieSession = require('cookie-session')

const DB = require('./src/DB');
var mcqTest=require('./src/mcqTest')
var getTeamScores=require('./src/getTeamScores')
const testQs = require('./src/testQs')
const teamLogin=require('./src/teamLogin')

const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/mcqTest', mcqTest.getMCQTest)
app.get('/addAns', mcqTest.addAns)
app.get('/reviewAns',  mcqTest.reviewAns)
app.get('/mcqGetOne', mcqTest.mcqGetOne)
app.get('/mcqSubmit', mcqTest.mcqSubmit)

app.get('/csvPage',getTeamScores.getYears)

app.get('/getCSV', getTeamScores.getCSV)

app.get('/teamLogin',teamLogin.getSchools)

app.post('/checkTeamPass',teamLogin.checkTeamPass)


app.get('/getMCQs', (req, res) => {
  DB.getMCQs()
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

app.post('/editMCQ', (req, res) => {
  DB.editMCQ({
    q_id: req.body.q_id,
    o_id: req.body.o_id,
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

app.post('/getTestQs', (req, res) => {
  DB.getTestQs({
    grade: req.body.grade})
  .then(function (result) {
    res.status(200).send(result);
  });
});

app.post('/addToTest', (req, res) => {
  DB.addToTest({
    q_id: req.body.q_id,
    grade: req.body.grade})
  .then((response) => {
    return response;
  });
});

app.post('/delFromTest', (req, res) => {
  DB.delFromTest({
    q_id: req.body.q_id,
    grade: req.body.grade})
  .then((response) => {
    return response;
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

app.post('/editTeam', (req, res) => {
  DB.editTeam({
    t_id: req.body.t_id,
    teamYear: req.body.teamYear,
    teamSchool: req.body.teamSchool,
    teamGrade: req.body.teamGrade
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


/* Test Questions */
app.get('/getMCQs', (req, res) => {
  testQs
    .getMCQs()
    .then(function (result) {
      res.status(200).send(result)
  })
})

app.post('/getTestQs', (req, res) => {
  testQs
    .getTestQs({grade: req.body.grade})
    .then(function (result) {
      res.status(200).send(result)
  })
})

app.post('/addToTest', (req, res) => {
  testQs
    .addToTest({
      q_id: req.body.q_id,
    grade: req.body.grade
    }).then((response) => {
      return response
    })
})

app.post('/delFromTest', (req, res) => {
  testQs
    .delFromTest({
      q_id: req.body.q_id,
    grade: req.body.grade
    }).then((response) => {
      return response
    })
})

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
