var mysql = require('./mysql')
const bcrypt = require('bcrypt');
const path= require('path');
const graderScratch = require('./graderScratch')

checkSup=exports.checkSup=(req,res)=>{
  var con
  const saltRounds = 10;
  let username=req.body.username
  let pwd=req.body.password

  return mysql.dbConnect()
  .then((c) => {
    con=c

    var sql_getPwd='select supervisor_name as username, supervisor_pw_hash as pwd from supervisors'
    con.query(sql_getPwd)
    .then((resPwd)=>{
      con.end()
      console.log('User entered: '+username+'  '+pwd)
      console.log('database username: '+resPwd[0].username)
      bcrypt.compare(pwd, resPwd[0].pwd, function(err, ress) {
        if(ress && username.toLowerCase()==resPwd[0].username.toLowerCase()) {

         console.log("Passwords match")
         req.session.supName=username
         // req.session.username=username
         // req.session.pwd=pwd
         res.sendFile(path.join(__dirname,'../public/superDash','index.html'));
        } else {
         console.log("Passwords don't match")
         let message='Login information incorrect'
         res.render('supLogin',{message})

        }
      })
    })
  })
}

checkGrader=exports.checkGrader=(req,res)=>{
  var con
  const saltRounds = 10;
  let username=req.body.username
  let pwd=req.body.password
  console.log('Here')
  return mysql.dbConnect()
  .then((c) => {
    con=c

    var sql_getPwd='select grader_pw_hash as pwd from graders where grader_name="'+username+'"'
    con.query(sql_getPwd)
    .then((resPwd)=>{
      con.end()
      console.log('User entered: '+username+'  '+pwd)
      //console.log('database username: '+resPwd[0].username)
      if(resPwd!=null)
      {
        bcrypt.compare(pwd, resPwd[0].pwd, function(err, result) {
          if(result) {

           console.log("Passwords match")
           req.session.graderName=username
           // req.session.pwd=pwd
           let message='Login successful'
           res.render('graderChooseSec')
           //graderScratch.graderSchoolsForScratch(req, res)
           //res.render('graderLogin',{})
          } else {
           console.log("Passwords don't match")
           let message='Login information incorrect'
           res.render('graderLogin',{message})

          }
        })
      }

    })
  })
}
