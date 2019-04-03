var mysql = require("./mysql");
var bodyParser = require("body-parser");

module.exports = {
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
  }
}
