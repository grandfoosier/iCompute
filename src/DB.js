var mysql = require("./mysql");
var bodyParser = require("body-parser");
var bcrypt = require("bcrypt");

module.exports = {
  getScores ({t_id }) {
    return mysql.dbConnect()
    .then(function (con) {
      var submitScore = "SELECT Q.text AS question, O.op_text AS answer, A.score " +
                        "FROM team_answers AS A, mc_ops aS O, questions AS Q, teams AS T, test_qs AS X " +
                        "WHERE A.team_id = T.team_id " +
                        "AND A.test_q_id = X.test_q_id " +
                        "AND A.mc_answer = O.mc_op_id " +
                        "AND O.q_id = Q.q_id " +
                        "AND T.team_id = ?";
      return con.query(submitScore, [t_id])

      .then(function (result) {
        con.end();
        return result;
      },
      function (errorMessage) {
        console.log("Error");
      });
    });
  },

////////////////////////////////////////////////////////////////////////////////

  validateGrader ({graderName, graderPW }) {
  return mysql.dbConnect()
  .then(function (con) {

    var sql_g_validate = 'SELECT * FROM graders WHERE grader_name = ?';
    con.query(sql_g_validate, [graderName, graderPW],function (err, result) {
      if (err) throw err;
      var test = JSON.stringify(result);
      var y=JSON.parse(test);
      username=y[0].grader_name;
      password=y[0].grader_pw_hash;

      if(graderName===username){

        bcrypt.compare("pass", password, function(err, res) {
          console.log("login succesful");

      });
      }else{
        console.log("check the credentials");
      }
    })
  });
}
}
