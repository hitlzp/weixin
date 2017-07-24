var express = require('express');
var bodyParser = require('body-parser')
var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var mysql = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'ni1234ren',
  database : 'fanzhuan'
});
app.use(express.static(__dirname + '/public'));

//教师学生登陆
app.post('/login', function (req, res) { 
	var sql, res_body;

	if(req.body.entryOption == 1) {
		sql = 'SELECT password from teacher WHERE email ='+ '\''+ req.body.user + '\'';//教师登陆
	}else {
		sql = 'SELECT password from student WHERE student_id ='+ '\''+ req.body.user + '\'';//学生登陆
	}

	connection.query(sql,function (err, rows, fields) {

        if(err || !rows || rows.length==0){
        	res_body = {
        		user_exist: 0 //用户名或密码错误
          	}
        }else {
        	res_body = {
        		user_exist: 1//用户存在，密码错误
          	}
          	if(rows[0].password == req.body.pwd)
          	{
          		res_body = {
        		user_exist: 2//用户名密码正确，登陆成功
          		}
          	}
        }

        if(req.body.user == '' || req.body.user == '')
        {
        	res_body = {
        		user_exist: 3//用户信息不全
          	}
        }
        res.json({haha: res_body});
	});
});

//教师注册
app.post('/teacherRegister', function (req, res) {

	var sql, res_body;
	sql = 'SELECT password from teacher WHERE email ='+ '\''+ req.body.email + '\'';

	connection.query(sql,function (err, rows, fields) {

		if(req.body.email == '' || req.body.userName == '' || req.body.pwd == '')
		{
			res_body = {
        		user_exist: 2 //用户信息不全
          	}
		}
		else{

	        if(err || !rows || rows.length==0){
	        	res_body = {
	        		user_exist: 0 //可以注册
	          	}

	          	var addUserSql = 'INSERT INTO teacher(email,name,password) VALUES(?,?,?)',
				addSqlParams = [req.body.email,req.body.userName,req.body.pwd],
				res_body;

			  	connection.query(addUserSql, addSqlParams, function (err, result) { 
				});
	        }
	        else 
	        {
	        	res_body = {
	        		user_exist: 1 //用户已存在
	          	}
	        }
		}
		res.json({haha: res_body});
	});
});


//教师端打印课程列表
app.post('/showCourseList', function (req, res) {
	var sql = 'SELECT * from course where teacher_id = ' + '\''+req.body.themail +'\'';
	connection.query(sql, function (err, result) {
        res.send(JSON.stringify(result));
	});
});



//学生注册
app.post('/studentRegister', function (req, res) {
	var sql, res_body;
	sql = 'SELECT password from student WHERE student_id ='+ '\''+ req.body.studentId + '\'';

	connection.query(sql,function (err, rows, fields) {

		if(req.body.studentId == '' || req.body.userName == '' || req.body.pwd == '')
		{
			res_body = {
        		user_exist: 2 //用户信息不全
          	}
		}
		else{

	        if(err || !rows || rows.length==0){
	        	res_body = {
	        		user_exist: 0 //可以注册
	          	}

	          	var addUserSql = 'INSERT INTO student(student_id,name,password) VALUES(?,?,?)',
				addSqlParams = [req.body.studentId,req.body.userName,req.body.pwd],
				res_body;

			  	connection.query(addUserSql, addSqlParams, function (err, result) { 
				});
	        }
	        else 
	        {
	        	res_body = {
	        		user_exist: 1 //用户已存在
	          	}
	        }
		}
		res.json({haha: res_body});
	});
});

//教师端和学生端？显示课程班列表
app.get('/showClassList', function (req, res) {
	var sql = 'SELECT * from class WHERE course_id='+req.query.course_id;
	connection.query(sql, function (err, result) {
		if(req.query.student_id) {
			var _sql = 'SELECT class_id from studentClass WHERE student_id='+req.query.student_id,
				res_body = {
					classList: result
				};
			connection.query(_sql, function (err, result) {
				res_body.studentClasses = result;
   				res.send(JSON.stringify(res_body));
			});
		}else {
        	res.send(JSON.stringify(result));
		}

	});
});

//教师添加课程班
app.post('/addClass', function (req, res) {
	var sql = 'SELECT * from class WHERE course_id='+req.body.course_id;
	connection.query(sql, function (err, result) {
        class_id = req.body.course_id + result.length;
        var addUserSql = 'INSERT INTO class(course_id,name,max_num,student_num,class_id) VALUES(?,?,?,0,?)',
			addSqlParams = [req.body.course_id,req.body.name,req.body.num,class_id],
			res_body;
		connection.query(addUserSql, addSqlParams, function (err, result) {
	  		res_body = {
	  			add_success: 1
	  		}
	        res.send(res_body);
		});
	});
});

//教师端训练题
app.get('/showExamList', function (req, res) {
	var sql = 'SELECT exam_id,exam_name from question WHERE course_id='+req.query.course_id;
	var new_result = [],
		exam_list = [];
	connection.query(sql, function (err, result) {
        for(var i=0;i<result.length; i++) {
        	if(exam_list.indexOf(result[i].exam_id)==-1) {
        		exam_list.push(result[i].exam_id);
        		new_result.push(result[i]);
        	}
        }
        res.send(JSON.stringify(new_result));
	});
});


//教师设置训练题
app.get('/showQuestionList', function (req, res) {
	var sql = 'SELECT * from question WHERE exam_id='+req.query.exam_id;
	connection.query(sql, function (err, result) {
        res.send(JSON.stringify(result));
	});
});

//教师选择训练题
app.post('/setpractice', function (req, res) {
	var str = '';

	var sql = 'SELECT * from practice WHERE classId='+req.body.classId;
	connection.query(sql, function (err, result) {
        str = req.body.classId + result.length;
        var addUserSql = 'INSERT INTO practice(courseId,classId,practiceName,startDate,endDate,startTime,endTime,questionList,practiceNum,practiceId,showendbtn,showgradebtn) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',
		addSqlParams = [req.body.courseId,req.body.classId,req.body.practiceName,req.body.startDate,req.body.endDate,req.body.startTime,req.body.endTime,req.body.questionList.toString(),req.body.practiceNum,str,'','none'],
		res_body;
	connection.query(addUserSql, addSqlParams, function (err, result) {
  		res_body = {
  			add_success: 1
  		}
        res.send(res_body);
        var sql = 'SELECT student_id FROM studentclass WHERE class_id='+req.body.classId;
        connection.query(sql, function (err, result) {
        	var questionNum = req.body.questionList.length;
        	for(var i=0;i<result.length;i++) {
        		var already_num = [];
        		for(var j=0;j<req.body.practiceNum;j++) {
        			var num = Math.ceil(Math.random()*(questionNum-1));
        			while(already_num.indexOf(num)!=-1) {
        				num = Math.ceil(Math.random()*(questionNum-1))
        			}
        			already_num.push(num);
        			var	addSql = 'INSERT INTO grades(question_id,student_id,practice_id) VALUES(?,?,?)',
        				addParams = [req.body.questionList[num],result[i].student_id,str];
        			connection.query(addSql, addParams, function (err, result) {
        			})
        		}
        	}
        });
	});
    })
	
});


//教师点击练习按钮，显示教师创建的所有练习
app.get('/practiceList', function (req, res) {
	if(req.query.student_id) {
		var practiceSql='SELECT * FROM studentclass inner join practice WHERE studentclass.class_id=practice.classId AND studentclass.student_id='+req.query.student_id,
			res_body = {};
		connection.query(practiceSql, function (err, result) {
			res_body.practice=result;
			var gradeSql='SELECT * FROM studentpractice WHERE student_id='+req.query.student_id;
			connection.query(gradeSql, function (err, result) {
				res_body.grades = result;
				res.send(JSON.stringify(res_body));
			})
		}) 
	}else {
		var sql = 'SELECT * from practice';
		connection.query(sql, function (err, result) {
	        res.send(JSON.stringify(result));
		});
	}
});


//教师端显示本次测验总体成绩
app.get('/gradeList', function (req, res) {


	var rr = 'select classId from practice where practiceId = '+req.query.practiceId;

	connection.query(rr, function (err, result) {
		if(result.length != 0)
		{
			myclassid = result[0].classId //先从practice表中查出当前练习对应的翻转班id
			var sql = 'select * from studentclass where class_id = '+myclassid,
			res_body = {};
			connection.query(sql, function (err, result) {
			var gradeSql = 'SELECT * FROM studentpractice inner join student WHERE studentpractice.student_id=student.student_id AND studentpractice.practice_id ='+req.query.practiceId;
			res_body.student_num = result.length;
			connection.query(gradeSql, function (err, result) {
				res_body.list = result;

				allstu = 'SELECT * FROM studentclass inner join student WHERE studentclass.student_id=student.student_id AND studentclass.class_id ='+myclassid+' and studentclass.student_id not in (SELECT student_id FROM studentpractice  WHERE  studentpractice.practice_id = '+req.query.practiceId+')';
				//查询的是参加课程但未参与做题的学生信息
				connection.query(allstu, function (err, result) {
					res_body.list2 = result;
					res.send(JSON.stringify(res_body));
				})
		});
	});
		}
	})
});


app.get('/examQuestionList', function (req, res) {
	var sql = 'SELECT * FROM grades WHERE practice_id='+req.query.practiceId;
	connection.query(sql, function (err, result) {
		res.send(JSON.stringify(result));
	});
});

app.get('/questionList', function (req, res) {
	if(req.query.student_id) {
		var sql = 'SELECT subject,optionDetail,imgUrl,question_id from question WHERE question_id in (SELECT question_id from grades WHERE practice_id= ? AND student_id= ?)',
			params = [req.query.practice_id,req.query.student_id];
		connection.query(sql,params, function (err, result) {
			res.send(JSON.stringify(result));
		});
	}else {
		var sql = 'SELECT subject,optionDetail,imgUrl,question_id from question WHERE question_id in (SELECT question_id from grades WHERE practice_id= ? )',
			params = [req.query.practice_id];
		connection.query(sql,params, function (err, result) {
			res.send(JSON.stringify(result));
		});
	}
});

//教师点击结束做题按钮，按钮变为查看成绩，并刷新页面
app.get('/endbtnToshowbtn', function (req, res) {
	var sql = 'update practice set showendbtn = \"none\",showgradebtn=\"\"  where practiceId = '+ req.query.practice_id;
	connection.query(sql, function (err, result) {
		res.send(JSON.stringify(result));
	});
});




app.listen(3000,function(){
	console.log('server start ....');

});