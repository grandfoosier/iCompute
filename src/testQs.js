var mysql = require("./mysql");

module.exports = {
	getMCQs () {
		return mysql.dbConnect()
		.then((con) => {
		  var sql_get_qoc = "select questions.q_id as ID, "+
		                    "       questions.text as Q, "+
												"       mc_ops.op_text as Os, "+
												"       mc_corrects.mc_op_id as C "+
	                      "from   questions, mc_ops, mc_corrects "+
	                      "where  mc_corrects.q_id = questions.q_id "+
	                      "and    mc_ops.q_id = questions.q_id"
		  return con.query(sql_get_qoc)
		  .then((result) => {
			con.end()
			return result
		  })
		})
  },

	getTestQs({grade})  {
		return mysql.dbConnect()
		.then(function (con) {
		  var sql_q_sel = "select questions.text, test_qs.* "+
		                  "from   test_qs, questions "+
										  "where  test_qs.q_id = questions.q_id "+
										  "and    grade = "+grade
		  return con.query(sql_q_sel)
		  .then(function (result) {
		    con.end()
		    return result
		  })
		})
  },

  addToTest ({q_id, grade }) {
		return mysql.dbConnect()
		.then(function (con) {
			var sql_chk_tqs = 'SELECT q_id FROM test_qs '+
												'WHERE  q_id = ? '+
												'AND    grade = ? '+
												'AND    year = 2019'
			return con.query(sql_chk_tqs, [q_id, grade])

			.then(result => {
				if (result.length != 0) {throw new Error("Question already exists"); }
		  	var sql_t_ins = 'INSERT INTO test_qs (q_id, grade, year) SELECT ?, ?, 2019';
		  	return con.query(sql_t_ins, [q_id, grade])

			  .then((result) => {
					console.log('question added');
					con.end();
					return;
			  })
			}).catch(e => console.error(`${e}`));
		})
  },

  delFromTest ({q_id, grade }) {
		return mysql.dbConnect()
		.then(function (con) {
			var sql_chk_tas = 'SELECT test_qs.test_q_id '+
												'FROM   test_qs, team_answers '+
												'WHERE  test_qs.q_id = ? '+
												'AND    grade = ? '+
												'AND    team_answers.test_q_id = test_qs.test_q_id'
			return con.query(sql_chk_tas, [q_id, grade])

			.then(result => {
				if (result.length != 0) {throw new Error("Question is being used"); }
	      var sql_t_del = 'DELETE FROM test_qs '+
											  'WHERE q_id = ? '+
											  'AND   grade = ? '+
											  'AND   year = 2019';
		  	return con.query(sql_t_del, [q_id, grade])

		  	.then((result) => {
					console.log('question removed')
					con.end()
					return
		  	})
			}).catch(e => console.error(`${e}`));
	  })
	}
}
