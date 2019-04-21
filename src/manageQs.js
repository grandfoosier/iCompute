var mysql = require("./mysql");
var bodyParser = require("body-parser");

module.exports = {
  getMCQs () {
    return mysql.dbConnect()
    .then((con) => {
      var sql_get_qoc = "SELECT questions.year AS Y, "+
                        "       questions.q_id AS ID, "+
                        "       questions.text AS Q, "+
                        //"       questions.section_id AS S, "+
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

  getScratch () {
    return mysql.dbConnect()
    .then((con) => {
      var sql_get_scr = "SELECT questions.year AS Y, "+
                        "       questions.q_id AS ID, "+
                        "       questions.text AS Q "+
                        "FROM   questions "+
                        "WHERE  questions.section_id = 'C' "+
                        "ORDER BY ID DESC";
      return con.query(sql_get_scr)

      .then((result) => {
        con.end();
        return result;
      });
    });
  },

  getImages ({q_id}) {
    return mysql.dbConnect()
    .then((con) => {
      var sql_get_img = "SELECT images.old_name, images.url "+
                        "FROM   images "+
                        "WHERE  images.q_id = ? "+
                        "ORDER BY q_id DESC";
      return con.query(sql_get_img, [q_id])

      .then((result) => {
        con.end();
        return result;
      });
    });
  },

  addScratch ({q_year, question }) {
    return mysql.dbConnect()
    .then(function (con) {
      var sql_s_add = "INSERT INTO questions (text, section_id, year) "+
                        "SELECT ?, 'C', ? "+
                        "WHERE NOT EXISTS ("+
                        "SELECT text FROM questions "+
                        "WHERE  text = ? "+
                        "AND    year = ?"+
                      ") LIMIT 1";
      return con.query(sql_s_add, [question, q_year, question, q_year])

      .then(function (result) {
        console.log("scratch question added");
        con.end();
        return result;
      },
      function (errorMessage) {
        console.log("question not added");
      });
    });
  },

  addScratchImg ({q_id, url, oldname}) {
    return mysql.dbConnect()
    .then(function (con) {
      var sql_i_add = "INSERT INTO images (old_name, url, q_id) "+
                      "SELECT ?, ?, ? "+
                      "WHERE NOT EXISTS ("+
                        "SELECT old_name FROM images "+
                        "WHERE  old_name = ? "+
                        "AND    q_id = ?"+
                      ") LIMIT 1";
      return con.query(sql_i_add, [oldname, url, q_id, oldname, q_id])

      .then(function (result) {
        console.log("image added");
        con.end();
        return;
      },
      function (errorMessage) {
        console.log(errorMessage);
        console.log("image not added");
      });
    });
  },

  editScratch ({q_id, q_year, question }) {
    return mysql.dbConnect()
    .then(function (con) {
      console.log('db');
      var sql_s_edt = "UPDATE questions AS Q "+
                        "SET Q.text = ? "+
                        "WHERE Q.q_id = ? "+
                        "AND NOT EXISTS ("+
                          "SELECT q.text "+
                          "FROM   (SELECT * FROM questions AS x) AS q "+
                          "WHERE  q.text = ? "+
                          "AND    q.year = ? "+
                          "AND    q.q_id <> ?)";
      console.log(sql_s_edt);
      return con.query(sql_s_edt, [question, q_id, question, q_year, q_id])

      .then(function (result) {
        if (result.affectedRows == 0) {
          console.log("Question already exists")
          return;
        }
        console.log("question updated");
        return "success";
      });
    });
  },

  removeScratch ({q_id }) {
    return mysql.dbConnect()
    .then(function(con) {
      var sql_q_test = "SELECT * FROM test_qs WHERE q_id = "+ q_id;
      return con.query(sql_q_test)

      .then(result => {
        if (result.length != 0) {throw new Error("Question is being used"); }
        var sql_i_del = "DELETE FROM images WHERE q_id = "+ q_id;
        return con.query(sql_i_del)

        .then((result) => {
          //console.log("images deleted");
          var sql_q_del = "DELETE FROM questions WHERE q_id = "+ q_id;
          return con.query(sql_q_del)

          .then((result) => {
            //console.log("question deleted");
            con.end();
            return "success";
          });
        });
      }).catch(e => {
        console.error(`${e}`)
        return "failure";
      });
    });
  },
}
