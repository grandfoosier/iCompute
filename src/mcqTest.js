
var mysql = require('./mysql')
var teamLogin = require('./teamLogin')


mcqGetOne=exports.mcqGetOne=(req,res)=>{
  var con
  const teamId=req.session.teamId
  const fromReview=true
  return mysql.dbConnect()
  .then((c) => {
    con=c
    const qId=req.query["qId"]
    const qNo=req.query["qNo"]
    var sql_q_with_ops='SELECT a.ans_id, t.test_q_id, a.mc_answer, q.text, o.mc_op_id, o.op_text, q.q_id, \
                        t.grade, t.year, a.team_id \
                        FROM questions AS q, mc_ops AS o, test_qs AS t LEFT JOIN team_answers AS a \
                        ON a.test_q_id=t.test_q_id \
                        WHERE t.q_id=q.q_id AND q.q_id=o.q_id \
                        AND a.team_id='+teamId+' AND t.q_id='+qId+
                        ' ORDER BY mc_op_id'
    con.query(sql_q_with_ops)
    .then((result)=>{
      con.end()
      res.render('mcq',{qNo, result, fromReview})
      })
    })
}

getMCQTest=exports.getMCQTest=(req,res)=>{
  var con
  let fromReview=false
  //grade hard coded to be changed later
  let grade=req.session.grade
  let year=req.session.year
  let teamId=req.session.teamId

// console.log('grade::: '+req.session.grade)
// console.log('year::: '+req.session.year)

  return mysql.dbConnect()
  .then((c) => {
    con=c
    let qNo=req.query["qNo"]
    if(qNo===undefined)
      qNo=0
    var sql_test_qs = 'SELECT t.q_id FROM test_qs as t, questions as q \
                        WHERE t.q_id=q.q_id AND grade='+grade+' AND t.year='+year+' AND section_id="A" \
                        ORDER BY test_q_id LIMIT '+qNo+',1'
    con.query(sql_test_qs)
    .then((result)=>{
      var sql_q_with_ops='SELECT a.ans_id, t.test_q_id, a.mc_answer, q.text, o.mc_op_id, o.op_text, q.q_id, \
                          t.grade, t.year, a.team_id \
                          FROM questions AS q, mc_ops AS o, test_qs AS t LEFT JOIN team_answers AS a \
                          ON a.test_q_id=t.test_q_id AND a.team_id='+teamId+' \
                          WHERE t.q_id=q.q_id AND q.q_id=o.q_id \
                          AND t.q_id='+result[0].q_id+' AND t.grade='+grade+
                          ' ORDER BY mc_op_id'
      con.query(sql_q_with_ops)
      .then((result)=>{
        con.end()
        res.render('mcq',{qNo, result, fromReview})
      })
    })
  })
}


addAns=exports.addAns=(req,res)=>{
  var con
  return mysql.dbConnect()
  .then((c) => {
    con=c
    const fromReview=req.query["fromReview"]

    var qNo = req.query["qNo"];
    var testQId=req.query["testQId"];
    var teamAns=req.query["teamAns"];
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
        var sql_update='UPDATE team_answers SET mc_answer=? WHERE test_q_id=? AND team_id=?'
        
        con.query(sql_update,[teamAns,testQId,teamId])
        .then((result)=>{
          con.end()

          if(qNo!=5 && fromReview=='false')
            getMCQTest(req,res)
          
        })
      } else {
        var sql_insert="INSERT INTO team_answers (team_id, test_q_id, mc_answer) values (?,?,?)";
        con.query(sql_insert,[teamId,testQId,teamAns])
        .then((result)=>{
          con.end
          if(qNo!=5 && fromReview=='false')
            getMCQTest(req,res)
        })
      }
        
    }).catch((error)=>{
      console.log('Error while adding or updating team ans ',error)
    })
  }).catch((error)=>{
    console.log('Error while connecting to database ',error)
  })
}


reviewAns=exports.reviewAns=(req,res)=>{
  const fromReview=req.query["fromReview"]
  
  'use strict'
  var con
  const mcqAll=[]
  
  addAns(req,res)
  .then(()=>{
    return mysql.dbConnect()
    .then((c) => {
      con=c
      var teamId=req.session.teamId

      var sql_test_q_ans='SELECT t.q_id AS q_id, q.text AS q_text, a.mc_answer AS mc_answer \
                              FROM questions AS q, test_qs AS t LEFT JOIN team_answers AS a \
                              ON a.test_q_id=t.test_q_id WHERE t.q_id=q.q_id AND \
                              a.team_id='+teamId
      con.query(sql_test_q_ans)
      .then((result)=>{
        for(let i=0; i<result.length; i++)
        {
          const ques=result[i]
          var sql_test_q_ops='SELECT op_text, mc_op_id FROM mc_ops WHERE q_id='+result[i].q_id
          con.query(sql_test_q_ops)
          .then((resultOps)=>{
            const qRow={}
            qRow['qInfo']=ques
            qRow.qOps=resultOps
            mcqAll.push(qRow)
            
            if(i===result.length-1)
              transferMcqAll(req, res, mcqAll, con)
          })
        }
      })
    })
  })
}

transferMcqAll=exports.transferMcqAll=(req, res, mcqAll, con)=>{
  con.end()
  res.render('mcqAll',{mcqAll})
}


mcqSubmit=exports.mcqSubmit=(req, res)=>{
  var con
  const teamId=req.session.teamId
  return mysql.dbConnect()
  .then((c) => {
    con=c
    const sql_check_answers='SELECT a.ans_id, a.team_id, t.test_q_id, a.mc_answer, mc_op_id \
                              FROM team_answers a, test_qs t, mc_ops o \
                              WHERE a.test_q_id=t.test_q_id AND t.q_id=o.q_id \
                              AND correct=1 AND team_id='+teamId
    con.query(sql_check_answers)
    .then((resultAns)=>{
      for(let i=0;i<resultAns.length;i++)
      {
        if(resultAns[i].mc_answer==resultAns[i].mc_op_id)
        {
          const sql_update_score='UPDATE team_answers SET score=2 WHERE test_q_id='+resultAns[i].test_q_id+' AND team_id='+teamId
          con.query(sql_update_score)
        }
      }
    })
    .then(()=>{
      const sql_upd_mcq_secScore='UPDATE teams SET mcq_score=(SELECT SUM(score) FROM team_answers WHERE team_id='+teamId+') \
                                   WHERE team_id='+teamId
      con.query(sql_upd_mcq_secScore)
      .then((resultUpd)=>{
        let title='MCQ score updated'
        con.end()
        teamLogin.goToTeamHome(req,res)
      })
    })
  })
}
