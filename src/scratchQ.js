var mysql = require('./mysql')

getScratchQ=exports.getScratchQ=(req,res)=>{
  var con
  const teamId=req.session.teamId
  const year=req.session.year
  const grade=req.session.grade

  return mysql.dbConnect()
  .then((c) => {
    con=c
    
    var sql_q_scratch='SELECT q.q_id AS q_id, q.text AS text \
						FROM test_qs AS t, questions AS q \
						WHERE t.q_id=q.q_id AND q.section_id="C" AND t.year='+year+' AND t.grade='+grade
    
    con.query(sql_q_scratch)
    .then((result)=>{
      var sql_getPics='SELECT old_name, url FROM images WHERE q_id='+result[0].q_id

      con.query(sql_getPics)
      .then((resPics)=>{
      	con.end()
      	res.render('scratchTest',{result,resPics})

      })
      })
    })
}
