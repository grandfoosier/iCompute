var mysql = require("./mysql");
var bodyParser = require("body-parser");
var bcrypt = require("bcrypt");

module.exports = {
  getMCQs () {
    return mysql.dbConnect()
    .then((con) => {
      var sql_get_qoc = "SELECT questions.year AS Y, "+
                        "       questions.q_id AS ID, "+
                        "       questions.text AS Q, "+
                        "       questions.section_id AS S, "+
                        "       mc_ops.op_text AS Os, "+
                        "       mc_ops.mc_op_id AS OID, "+
                        "       mc_ops.correct AS C "+
                        "FROM   questions, mc_ops "+
                        "WHERE  mc_ops.q_id = questions.q_id "+
                        "ORDER BY ID DESC";
      return con.query(sql_get_qoc)
      .then((result) => {
        con.end();
        return result;
      });
    });
  },

  addMCQ ({q_year, question, option1, option2, option3, option4, corr_op }) {
    return mysql.dbConnect()
    .then(function (con) {
      var sql_q_add = "INSERT INTO questions (text, section_id, year) "+
                      "SELECT ?, 'A', "+ q_year +" "+
                      "FROM   questions "+
                      "WHERE NOT EXISTS ("+
                        "SELECT text FROM questions "+
                        "WHERE  text = ? "+
                        "AND    year = ?"+
                      ") LIMIT 1";
      return con.query(sql_q_add, [question, question, q_year])

      .then(function (result) {
        //console.log("question added");
        var q_id = result.insertId;
        var sql_o_add = "INSERT INTO mc_ops (op_text, q_id, mc_op_letter, correct) VALUES ?";
        var values = [[option1, q_id, "a", 0],
                      [option2, q_id, "b", 0],
                      [option3, q_id, "c", 0],
                      [option4, q_id, "d", 0]];
        values[corr_op][3] = 1;
        return con.query(sql_o_add, [values])

        .then(function (result) {
          //console.log("options added");
          con.end();
          return;
        },
        function (errorMessage) {
          console.log("question not added");
        });
      });
    });
  },

  editMCQ ({q_id, o_id, q_year, question, option1, option2, option3, option4, corr_op }) {
    return mysql.dbConnect()
    .then(function (con) {
      var sql_q_edt = "UPDATE questions AS Q "+
                        "SET Q.text = ? "+
                        "WHERE Q.q_id = ? "+
                        "AND NOT EXISTS ("+
                          "SELECT q.text "+
                          "FROM   (SELECT * FROM questions AS x) AS q "+
                          "WHERE  q.text = ? "+
                          "AND    q.year = ? "+
                          "AND    q.q_id <> ?)";
      return con.query(sql_q_edt, [question, q_id, question, q_year, q_id])

      .then(function (result) {
        if (result.affectedRows == 0) {
          console.log("Question already exists")
          return;
        }

        //console.log("question updated");
        var options = [option1, option2, option3, option4];
        for (i=0; i<4; i++) {
          var iscorr = 0;
          if (i==corr_op) {iscorr = 1; }
          var sql_o_edt = "UPDATE mc_ops "+
                          "SET op_text = ?, correct = ? "+
                          "WHERE mc_op_id = ?";
          con.query(sql_o_edt, [options[i], iscorr, parseInt(o_id) + i]);
        }
        //console.log("options updated");
        return "success";
      });
    });
  },

  removeMCQ ({q_id }) {
    return mysql.dbConnect()
    .then(function(con) {
      var sql_q_test = "SELECT * FROM test_qs WHERE q_id = "+ q_id;
      return con.query(sql_q_test)

      .then(result => {
        if (result.length != 0) {throw new Error("Question is being used"); }
        var sql_o_del = "DELETE FROM mc_ops WHERE q_id = "+ q_id;
        return con.query(sql_o_del)

        .then((result) => {
          //console.log("options deleted");
          var sql_q_del = "DELETE FROM questions WHERE q_id = "+ q_id;
          return con.query(sql_q_del)

          .then((result) => {
            //console.log("question deleted");
            con.end();
            return;
          });
        });
      }).catch(e => console.error(`${e}`));
    });
  },

/*//////////////////////////////////////////////////////////////////////////////

  getTestQs({grade})  {
    return mysql.dbConnect()
    .then(function (con) {
      var sql_q_sel = "select questions.text, test_qs.* "+
                      "from   test_qs, questions "+
                      "where  test_qs.q_id = questions.q_id "+
                      "and    grade = ?"
      return con.query(sql_q_sel, [grade])
      .then(function (result) {
        con.end()
        return result
      })
    })
  },

  addToTest ({q_id, grade }) {
    return mysql.dbConnect()
    .then(function (con) {
      var sql_c_del = 'INSERT INTO test_qs (q_id, grade, year) '+
                      'SELECT '+ q_id +', '+ grade +', 2019 '+
                      'WHERE NOT EXISTS ('+
                      'SELECT test_qs.q_id FROM test_qs '+
                      'WHERE  test_qs.q_id = '+ q_id +' '+
                      'AND    test_qs.grade = '+ grade +' '+
                      'AND    test_qs.year = 2019'+
                      ') LIMIT 1'
      return con.query(sql_c_del)
      .then((result) => {
        console.log('question added')
        con.end()
        return
      })
    })
  },

  delFromTest ({q_id, grade }) {
    return mysql.dbConnect()
    .then(function (con) {
      var sql_c_del = 'DELETE FROM test_qs '+
                      'WHERE q_id = '+ q_id +' '+
                      'AND   test_qs.grade = '+ grade +' '+
                      'AND   test_qs.year = 2019 '+
                      'AND   test_qs.test_q_id NOT IN '+
                      '(SELECT test_q_id FROM team_answers)'
      return con.query(sql_c_del)
      .then((result) => {
        console.log('question removed')
        con.end()
        return
      })
    })
  },

//////////////////////////////////////////////////////////////////////////////*/

  getSuper () {
    return mysql.dbConnect()
    .then((con) => {
      var sql_get_sup = "SELECT supervisor_name AS name FROM supervisors";
      return con.query(sql_get_sup)
      .then((result) => {
        con.end();
        return result;
      });
    });
  },

  editSuper ({superName }) {
    return mysql.dbConnect()
    .then(function (con) {
      var sql_s_edt = "UPDATE supervisors AS S "+
                      "SET    S.supervisor_name = ? "+
                      "WHERE  S.supervisor_id = 1";
      return con.query(sql_s_edt, [superName])

      .then(function (result) {
        //console.log("super updated");
        con.end();
        return;
      },
      function (errorMessage) {
        console.log("super not updated");
      });
    });
  },

  resetPwSuper ({superPW }) {
    return mysql.dbConnect()
    .then(function (con) {
      var sql_s_set = "UPDATE supervisors "+
                      "SET supervisor_pw_hash = ? "+
                      "WHERE supervisor_id = 1";
      return con.query(sql_s_set, [superPW])

      .then(function (result) {
        console.log("password set");
        con.end();
        return;
      },
      function (errorMessage) {
        console.log("password not set");
      });
    });
  },

  getGraders () {
    return mysql.dbConnect()
    .then((con) => {
      var sql_get_grd = "SELECT grader_name AS name, grader_id AS ID "+
                        "FROM   graders "+
                        "ORDER BY ID DESC";
      return con.query(sql_get_grd)
      .then((result) => {
        con.end();
        return result;
      });
    });
  },

  addGrader ({graderName, graderPW }) {
    return mysql.dbConnect()
    .then(function (con) {
      var sql_g_add = "INSERT INTO graders (grader_name, grader_pw_hash) "+
                      "SELECT ?, ? "+
                      "FROM   graders "+
                      "WHERE NOT EXISTS ("+
                        "SELECT grader_name FROM graders "+
                        "WHERE  grader_name = ?"+
                      ") LIMIT 1";
      return con.query(sql_g_add, [graderName, graderPW, graderName])

      .then(function (result) {
        //console.log("grader added");
        con.end();
        return;
      },
      function (errorMessage) {
        console.log("grader not added");
      });
    });
  },

  editGrader ({g_id, graderName }) {
    return mysql.dbConnect()
    .then(function (con) {
      var sql_g_edt = "UPDATE graders AS G "+
                      "SET    G.grader_name = ? "+
                      "WHERE  G.grader_id = ? "+
                      "AND NOT EXISTS ("+
                        "SELECT g.grader_name "+
                        "FROM   (SELECT * FROM graders AS x) AS g "+
                        "WHERE  g.grader_name = ?)";
      return con.query(sql_g_edt, [graderName, g_id, graderName])

      .then(function (result) {
        //console.log("grader updated");
        con.end();
        return;
      },
      function (errorMessage) {
        console.log("grader not updated");
      });
    });
  },

  removeGrader ({g_id }) {
    return mysql.dbConnect()
    .then(function(con) {
      var sql_g_rem = "DELETE FROM graders WHERE grader_id = "+ g_id;
      return con.query(sql_g_rem)

      .then((result) => {
        //console.log("grader removed");
        con.end();
        return;
      });
    }).catch(e => console.error(`${e}`));
  },

  resetPwGrader ({g_id, graderPW }) {
    return mysql.dbConnect()
    .then(function (con) {
      var sql_g_set = "UPDATE graders "+
                      "SET grader_pw_hash = ? "+
                      "WHERE grader_id = "+ g_id;
      return con.query(sql_g_set, [graderPW])

      .then(function (result) {
        //console.log("password set");
        con.end();
        return;
      },
      function (errorMessage) {
        console.log("password not set");
      });
    });
  },

  getTeams () {
    return mysql.dbConnect()
    .then((con) => {
      var sql_get_team = "SELECT school, grade, year, team_id "+
                         "FROM   teams "+
                         "ORDER BY year DESC, school ASC, grade ASC";
      return con.query(sql_get_team)
      .then((result) => {
        con.end();
        return result;
      });
    });
  },

  addTeam ({t_year, school, grade, teamPW }) {
    return mysql.dbConnect()
    .then(function (con) {
      var sql_t_add = "INSERT INTO teams (school, team_pw_hash, grade, year) "+
                      "SELECT ?, ?, ?, ? "+
                      "FROM   teams "+
                      "WHERE NOT EXISTS ("+
                        "SELECT school FROM teams "+
                        "WHERE  school = ? "+
                        "AND    grade = ? "+
                        "AND    year = ?"+
                      ") LIMIT 1";
      return con.query(sql_t_add, [school, teamPW, grade, t_year, school, grade, t_year])

      .then(function (result) {
        //console.log("team added");
        con.end();
        return;
      },
      function (errorMessage) {
        console.log("team not added");
      });
    });
  },

  editTeam ({t_id, teamYear, teamSchool, teamGrade }) {
    return mysql.dbConnect()
    .then(function (con) {
      var sql_t_edt = "UPDATE teams AS T "+
                      "SET    T.school = ?, T.grade = ? "+
                      "WHERE  T.team_id = ? "+
                      "AND NOT EXISTS ("+
                        "SELECT t.school "+
                        "FROM   (SELECT * FROM teams AS x) AS t "+
                        "WHERE  t.school = ? "+
                        "AND    t.grade = ? "+
                        "AND    t.year = ?)";
      return con.query(sql_t_edt, [teamSchool, teamGrade, t_id, teamSchool, teamGrade, teamYear])

      .then(function (result) {
        console.log("team updated");
        con.end();
        return;
      },
      function (errorMessage) {
        console.log(errorMessage);
        console.log("team not updated");
      });
    });
  },

  removeTeam ({t_id }) {
    return mysql.dbConnect()
    .then(function(con) {
      var sql_t_test = "SELECT * FROM team_answers WHERE team_id = "+ t_id;
      return con.query(sql_t_test)

      .then(result => {
        if (result.length != 0) {throw new Error("Team has submitted a test"); }
        var sql_t_rem = "DELETE FROM teams WHERE team_id = "+ t_id;
        return con.query(sql_t_rem)

        .then((result) => {
          //console.log("team removed");
          con.end();
          return;
        });
      }).catch(e => console.error(`${e}`));
    });
  },

  resetPwTeam ({t_id, teamPW }) {
    return mysql.dbConnect()
    .then(function (con) {
      var sql_t_set = "UPDATE teams "+
                      "SET team_pw_hash = ? "+
                      "WHERE team_id = "+ t_id;
      return con.query(sql_t_set, [teamPW])

      .then(function (result) {
        //console.log("password set");
        con.end();
        return;
      },
      function (errorMessage) {
        console.log("password not set");
      });
    });
  },

////////////////////////////////////////////////////////////////////////////////

  submitScore ({t_id }) {
    return mysql.dbConnect()
    .then(function (con) {
      console.log(t_id)
      var submitScore = "SELECT Q.text AS question, O.op_text AS answer, A.score " +
      "FROM team_answers AS A, mc_ops aS O, questions AS Q, teams AS T, test_qs AS X " +
      "WHERE A.team_id = T.team_id " +
      "AND A.test_q_id = X.test_q_id " +
      "AND A.mc_answer = O.mc_op_id " +
      "AND O.q_id = Q.q_id " +
      "AND T.team_id = ?";
      console.log(submitScore)
      return con.query(submitScore, [t_id])
      .then(function (result) {
        console.log(result)
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
