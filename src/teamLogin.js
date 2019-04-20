var mysql = require('./mysql')
const bcrypt = require('bcrypt');

getSchools=exports.getSchools=(req,res,message)=>{
  var con
  let result4th={}
  let result5th={}

  req.session=null
  
  return mysql.dbConnect()
  .then((c) => {
    con=c
    
    var sql_getSchool_4th='SELECT school FROM teams WHERE year=YEAR(CURDATE()) AND grade=4 GROUP BY school'

    con.query(sql_getSchool_4th)
    .then((result4th)=>{
      var sql_getSchool_5th='SELECT school FROM teams WHERE year=YEAR(CURDATE()) AND grade=5 GROUP BY school'
      con.query(sql_getSchool_5th)
      .then((result5th)=>{
        con.end()
        
        res.render('teamLogin',{result4th,result5th,message})
      })
    })
    
  })
}


checkTeamPass=exports.checkTeamPass=(req,res)=>{
  var con
  const saltRounds = 10;
  let grade=req.body.grade
  let school=req.body.school
  let pwd=req.body.pwd

  return mysql.dbConnect()
  .then((c) => {
    con=c
    
    var sql_getPwd='SELECT team_id, team_pw_hash as pwd, year FROM teams WHERE grade='+grade+' AND school="'+school+'"'
    console.log(sql_getPwd)
    con.query(sql_getPwd)
    .then((resPwd)=>{
      con.end()
      bcrypt.compare(pwd, resPwd[0].pwd, function(err, ress) {
        if(ress) {
         console.log("Passwords match")
         req.session.teamId=resPwd[0].team_id
         req.session.school=school
         req.session.grade=grade
         req.session.year=resPwd[0].year

         res.render('teamHome',{teamId:resPwd[0].team_id, school, grade })
        } else {
         console.log("Passwords don't match")
         let message='Login information incorrect'
         getSchools(req,res,message)
         //res.render('teamLogin',{message:'Login information incorrect'})
        } 
      })
      
    })
    
  })
}