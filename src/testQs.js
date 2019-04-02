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
  }
}