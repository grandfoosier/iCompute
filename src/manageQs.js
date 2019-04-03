var mysql = require("./mysql");
var bodyParser = require("body-parser");

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
  }
}
