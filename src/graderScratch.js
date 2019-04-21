var mysql = require('./mysql')

graderSchoolsForScratch=exports.graderSchoolsForScratch=(req,res)=>{
	var con
	let result4th={}
	let result5th={}

	res.locals.graderName = req.session.graderName;

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
	        
	        res.render('graderSchools',{result4th,result5th})
	      })
	    })  
    })
}

downloadScratch=exports.downloadScratch=(req,res)=>{
	console.log('Download scratch code here')

	console.log('Show scoring info')
}