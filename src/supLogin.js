var mysql = require('./mysql')
const bcrypt = require('bcrypt');
const path= require('path');

// getID=exports.getID=(req,res,message)=>{
//   var con
//   let result={}
//
//   req.session=null
//
//   return mysql.dbConnect()
//   .then((c) => {
//     con=c
//   })
// }

checkSup=exports.checkSup=(req,res)=>{
  var con
  console.log("here")
  const saltRounds = 10;
  let username=req.body.username
  let pwd=req.body.password

  return mysql.dbConnect()
  .then((c) => {
    con=c

    var sql_getPwd='select supervisor_name as username, supervisor_pw_hash as pwd from supervisors'
    console.log(sql_getPwd)
    console.log('Entered password: '+pwd)
    con.query(sql_getPwd)
    .then((resPwd)=>{
      con.end()
      bcrypt.compare(pwd, resPwd[0].pwd, function(err, ress) {
        if(ress) {

         console.log("Passwords match")
         req.session.username=username
         req.session.pwd=pwd
         res.sendFile(path.join(__dirname+'/index.html'));
        } else {
         console.log("Passwords don't match")
         let message='Login information incorrect'
         res.render('supLogin',{message})

        }
      })

    })
  })
}
