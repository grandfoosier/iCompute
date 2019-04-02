var mysql = require('./mysql')
var fs=require('fs')

getYears=exports.getYears=(req,res)=>{
  var con
  return mysql.dbConnect()
  .then((c) => {
    con=c
    
    var sql_getYears='SELECT year FROM teams GROUP BY year ORDER BY year DESC'
    con.query(sql_getYears)
    .then((result)=>{
      con.end()
      res.render('downloadCSV',{result})
      })
    })
}

getCSV=exports.getCSV=(req,res)=>{
  
  var con
  let row=''
  return mysql.dbConnect()
  .then((c) => {
    con=c
    let year=req.query['year']
    let grade=req.query['grade']
    
    var sql_getYears='SELECT school, grade, mcq_score, sa_score, scratch_score, \
                      (mcq_score+sa_score+scratch_score) AS total, ranking \
                      FROM teams WHERE year='+year+' AND grade='+grade+' ORDER BY total DESC'
    
    con.query(sql_getYears)
    .then((result)=>{
      con.end()

      let heading='"'+"SCHOOL"+'"'+','+
                '"'+"GRADE"+'"'+','+
                '"'+"MCQ SCORE"+'"'+','+
                '"'+"SA SCORE"+'"'+','+
                '"'+"SCRATCH SCORE"+'"'+','+
                '"'+"TOTAL SCORE"+'"'+','+
                '"'+"RANKING"+'"'+'\n'
      fs.writeFile('results.csv', heading, err => {
         if(err) throw err;
       })

      for(var i=0; i<result.length; i++){
        row=row+'"'+result[i].school+'"'+','+
            '"'+result[i].grade+'"'+','+
            '"'+result[i].mcq_score+'"'+','+
            '"'+result[i].sa_score+'"'+','+
            '"'+result[i].scratch_score+'"'+','+
            '"'+result[i].total+'"'+','+
            '"'+result[i].ranking+'"'+'\n'
      }

      const doWorkPromise=new Promise((resolve, reject) => {
          return fs.appendFile('results.csv', row, err => {
            if(err)
              reject(err)
            else
              resolve('Written to file')
          })
      })

      doWorkPromise.then((result)=>{
          console.log('Success: ',result)
          downloadFile(req, res)
      }).catch((error)=>{
          console.log('Error',error)
      })
      
     })
  })
}


downloadFile=exports.downloadFile=(req, res)=>{
  var file = __dirname + '/../results.csv';
  res.download(file);
}