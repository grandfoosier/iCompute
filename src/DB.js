var mysql = require("./mysql");

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

  getTeams () {
    return mysql.dbConnect()
    .then((con) => {
      var sql_get_team = "SELECT school, grade, year "+
                         "FROM   teams "+
                         "ORDER BY year DESC, school ASC, grade ASC";
      return con.query(sql_get_team)
      .then((result) => {
        con.end();
        return result;
      });
    });
  },

  createMCQ ({q_year, question, option1, option2, option3, option4, corr_op }) {
    return mysql.dbConnect()
    .then(function (con) {
      var sql_q_add = "INSERT INTO questions (text, section_id, year) "+
                        "SELECT ?, 'A', "+ q_year + " "+
                        "FROM questions "+
                        "WHERE NOT EXISTS ("+
                          "SELECT text FROM questions "+
                          "WHERE  text = ? "+
                          "AND    year = "+ q_year +
                        ") LIMIT 1";
      return con.query(sql_q_add, [question, question])

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

  deleteMCQ ({q_year, q_id }) {
    return mysql.dbConnect()
    .then(function(con) {
      var sql_q_test = "SELECT * "+
                       "FROM   test_qs "+
                       "WHERE  q_id = "+ q_id +" "+
                       "AND    year = "+ q_year;
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

  addGrader ({graderName, graderPW }) {
    return mysql.dbConnect()
    .then(function (con) {
      console.log(graderName);
      console.log(graderPW);
      var sql_g_add = "INSERT INTO graders (grader_name, grader_pw_hash) "+
                        "SELECT ?, ? "+
                        "FROM graders "+
                        "WHERE NOT EXISTS ("+
                          "SELECT grader_name FROM graders "+
                          "WHERE grader_name = ?"+
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
  }
}
