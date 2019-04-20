var mysql = require("./mysql");

module.exports = {
	getQs () {
		return mysql.dbConnect()
		.then((con) => {
		  var sql_get_qoc = "select distinct questions.text as Q, "+
												"       questions.q_id as ID, "+
		                    "       questions.section_id as S "+
	                      "from   questions "+
												"order by S, ID"
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
		  var sql_q_sel = "select questions.text, questions.section_id, test_qs.* "+
		                  "from   test_qs, questions "+
										  "where  test_qs.q_id = questions.q_id "+
										  "and    grade = "+grade+" "+
											"order by questions.section_id, test_qs.test_q_id"
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
