var mysql = require('./mysql')
var fs=require('fs')
var path=require('path')

graderSchoolsForScratch=exports.graderSchoolsForScratch=(req,res)=>{
	var con
	let result4th={}
	let result5th={}

	res.locals.graderName = req.session.graderName;

	return mysql.dbConnect()
	.then((c) => {
		con=c
		var sql_getSchool_4th='SELECT school FROM teams WHERE year=YEAR(CURDATE()) AND grade=4 AND scratch_score=0 GROUP BY school'
		con.query(sql_getSchool_4th)
	    .then((result4th)=>{
	      var sql_getSchool_5th='SELECT school FROM teams WHERE year=YEAR(CURDATE()) AND grade=5 AND scratch_score=0  GROUP BY school'
	      con.query(sql_getSchool_5th)
	      .then((result5th)=>{
	        con.end()
	        
	        res.render('graderSchools',{result4th,result5th})
	      })
	    })  
    })
}

downloadScratch=exports.downloadScratch=(req,res)=>{
	
	const school= req.body.school;
	const grade= req.body.grade;
	const year=new Date().getFullYear();

	let scratchFile = path.join(__dirname, '../'+'public/scratch_files/'+school + year + '-' +grade+'.sb3')
	
	console.log(scratchFile);
	res.download(scratchFile, function(err){
		if(err) {
	    // Check if headers have been sent
	    if(res.headersSent) {
	      // You may want to log something here or do something else
	      console.log("Error while downloading file"+err)
	    } else {
	      //return res.sendStatus(404); // 404, maybe 500 depending on err
	      graderSchoolsForScratch(req,res)
	    }
	  }
	})
		
}

gradeTeamScr=exports.gradeTeamScr=(req, res)=>{
	
	var con
	let grade=req.body.grade
	let school=req.body.school
	let teamId=0
	let testQId=0
	let scratchScore=req.body.score
	if(scratchScore=='')
		scratchScore=0

	return mysql.dbConnect()
	.then((c) => {
		con=c
		var sql_getTeam_Id='SELECT team_id from teams WHERE school="'+school+'" and grade='+grade+' and year=YEAR(CURDATE())'
		con.query(sql_getTeam_Id)
	    .then((resultTeamId)=>{
	    	teamId=resultTeamId[0].team_id;
	      	var sql_getQId='SELECT test_q_id FROM test_qs as t, questions as q \
	      					WHERE t.q_id=q.q_id AND section_id="C" AND grade='+grade+' AND q.year=YEAR(CURDATE())'
	      con.query(sql_getQId)
	      .then((resultQId)=>{
	      	testQId=resultQId[0].test_q_id
	      	var sql_insertQScore= 'INSERT INTO team_answers (team_id, test_q_id, score) VALUES (?,?,?)'
	      	con.query(sql_insertQScore,[teamId,testQId,scratchScore])
	      	.then((resultInsertQScr)=>{
	      		var updt_teamScratchScr='UPDATE teams SET scratch_score='+scratchScore+' \
	      									WHERE grade='+grade+' AND year=YEAR(CURDATE()) AND school="'+school+'"'
	      		console.log(updt_teamScratchScr)
	      		con.query(updt_teamScratchScr)
	      		.then((resultUpdtTeamScr)=>{
	      			con.end()
	      			graderSchoolsForScratch(req,res)
	      		})
	      	})
	      })
	    })  
    })
}
