var mysql = require('./mysql')
var teamLogin=require('./teamLogin')

getSAQs=exports.getSAQs=(req,res)=>{
	var con
	const teamId=req.session.teamId
	const grade=req.session.grade
	const year=req.session.year
	const fromReview=false
	
	return mysql.dbConnect()
	.then((c) => {
	con=c
	
	let qNo=req.body.qNo
    if(qNo===undefined)
      qNo=0

	var sql_q_with_ops='SELECT t.test_q_id, q.q_id, t.grade, t.year, q.text, a.sa_answer \
						FROM questions as q, test_qs as t left join team_answers as a \
						on a.test_q_id=t.test_q_id AND a.team_id='+teamId+' \
						WHERE t.q_id=q.q_id and grade='+grade+' AND t.year= YEAR(CURDATE()) and section_id="B" \
						ORDER BY test_q_id LIMIT '+qNo+',1'

	console.log(sql_q_with_ops)
	con.query(sql_q_with_ops)
	.then((result)=>{
		var sql_getImg='select old_name, url from images where q_id='+result[0].q_id
		con.query(sql_getImg)
		.then((resImg)=>{
			con.end()
			res.render('saTest',{qNo,result,resImg, fromReview})
		})
	})

	})
}


addSaAns=exports.addSaAns=(req,res)=>{
  var con
  return mysql.dbConnect()
  .then((c) => {
    con=c
    const fromReview=req.body.fromReview

    var qNo = req.body.qNo;
    var testQId=req.body.testQId;
    var teamAns=req.body.saAns;
    var teamId=req.session.teamId
    if(!qNo)
      qNo=0
    if(teamAns==''){
      console.log('Team Ans::: '+teamAns)
      teamAns=null  
    }
    

    var sql_check = 'SELECT * FROM team_answers WHERE team_id=? AND test_q_id=?'
    con.query(sql_check,[teamId,testQId])
    .then((result)=>{
      if(result.length>0)
      {
        var sql_update='UPDATE team_answers SET sa_answer=? WHERE test_q_id=? AND team_id=?'
        
        con.query(sql_update,[teamAns,testQId,teamId])
        .then((result)=>{
          con.end()
          console.log('Update')
          console.log('teamId: '+teamId)
          console.log('testQId: '+testQId)
          console.log('qNo: '+qNo)

          if(qNo!=2 && fromReview=='false')
          {
          	//req.body.qNo=parseInt(qNo)+1
          	getSAQs(req,res)
          }
          else{
          	teamLogin.goToTeamHome(req,res)
          }
          
        })
      } else {
        var sql_insert="INSERT INTO team_answers (team_id, test_q_id, sa_answer) values (?,?,?)";
        con.query(sql_insert,[teamId,testQId,teamAns])
        .then((result)=>{
          con.end()
          console.log('Insert')
          console.log('teamId: '+teamId)
          console.log('testQId: '+testQId)
          console.log('qNo: '+qNo)

          if(qNo!=2 && fromReview=='false')
          {
          	//req.body.qNo=parseInt(qNo)+1
          	getSAQs(req,res)
          }
          else
          {
          	teamLogin.goToTeamHome(req,res)
          }
        })
      }
        
    }).catch((error)=>{
      console.log('Error while adding or updating team ans ',error)
    })
  }).catch((error)=>{
    console.log('Error while connecting to database ',error)
  })
}