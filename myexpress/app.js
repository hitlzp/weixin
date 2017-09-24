var express = require('express');
var bodyParser = require('body-parser');
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


//教师添加课程班
app.post('/addClass', function (req, res) {
	var sql = 'SELECT * from class WHERE course_id='+req.body.course_id;
	connection.query(sql, function (err, result) {
		class_id = req.body.course_id + result.length;
		var addUserSql = 'INSERT INTO class(course_id,name,max_num,student_num,class_id, password) VALUES(?,?,?,0,?,?)',
		addSqlParams = [req.body.course_id,req.body.name,req.body.num,class_id,req.body.pwd],
		res_body;
		connection.query(addUserSql, addSqlParams, function (err, result) {
			res_body = {
				add_success: 1
			}
			var mysql1 = 'insert into manager(group_down, group_up, mark_down, mark_up, practiceID, class_id, attend)VALUES(?,?,?,?,?,?,?)',
			addmysqlparams1 = [0,0,0,0,0,class_id,0];
			connection.query(mysql1, addmysqlparams1, function (err, result) {
				res.send(res_body);
			})
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
		var addUserSql = 'INSERT INTO practice(courseId,classId,practiceName,startDate,endDate,startTime,endTime,questionList,practiceNum,practiceId,showendbtn,showgradebtn, showstartbtn) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)',
		addSqlParams = [req.body.courseId,req.body.classId,req.body.practiceName,req.body.startDate,req.body.endDate,req.body.startTime,req.body.endTime,req.body.questionList.toString(),req.body.practiceNum,str,'none','none',''],
		res_body;
		connection.query(addUserSql, addSqlParams, function (err, result) {
			res_body = {
				practice_id: str,
			}
			var sql1 = 'select student_id from studentclass where class_id = '+req.body.classId;
			connection.query(sql1, function (err, result) {
				res_body.allstu = result;
				res.send(res_body);
			})
		});
	})

	
});

//新建习题集后将有关数据保存到grades表中
app.post('/savegradesconfig', function (req, res) {
	for(var i=0; i <req.body.questionlist.length;i++)
	{
		for(var j=0; j < req.body.studentlist.length;j++)
		{
			var sql1 = 'insert into grades(question_id, student_id, practice_id)values(?,?,?)',
			addSqlParams = [req.body.questionlist[i], req.body.studentlist[j], req.body.practiceid];
			connection.query(sql1, addSqlParams, function (err, result) {
			})
		}
	}
	res.send('ok');
	
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
		var sql = 'SELECT * from practice where classId = ' + req.query.class_id;
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
	var sql = 'SELECT grades.question_id,grades.student_id,grades.answer,grades.postAnswer,student.name FROM grades inner join student WHERE grades.student_id = student.student_id and grades.practice_id='+req.query.practiceId;
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
		var sql = 'select questionList from practice where practiceId='+req.query.practice_id;//先读出当前练习的所有习题的id
		connection.query(sql,function (err, result) {
			res.send(JSON.stringify(result));
		});
	}
});

//根据习题id在question表中查找习题信息
app.get('/allquestions', function (req, res) {
	console.log(req.query.questionlist)
	var thesequestions = req.query.questionlist.split(',')
	var instring = "'"+thesequestions.join("','")+"'";  
	var sql = 'SELECT subject,optionDetail,imgUrl,question_id from question where question_id in ('+instring+")";;
	connection.query(sql,function (err, result) {
		res.send(JSON.stringify(result));
	});
});


//教师点击开始做题按钮，按钮变为停止做题，并刷新页面
app.get('/startbtnToshowbtn', function (req, res) {
	var sql = 'update practice set showendbtn = \"\",showstartbtn = \"none\",showgradebtn=\"none\"  where practiceId = '+ req.query.practice_id;
	connection.query(sql, function (err, result) {
		sql2 = 'select classId from practice where practiceId = ' + req.query.practice_id;
		connection.query(sql2, function (err, result) {
			sql3 = 'update manager set practiceID = ' + req.query.practice_id + ' where class_id = ' + result[0].classId;
			connection.query(sql3, function (err, result) {
				res.send(JSON.stringify(result));
			});
		});
	});
});

//教师点击结束做题按钮，按钮变为查看成绩，并刷新页面
app.get('/endbtnToshowbtn', function (req, res) {
	var sql = 'update practice set showendbtn = \"none\",showstartbtn = \"none\",showgradebtn=\"\"  where practiceId = '+ req.query.practice_id;
	connection.query(sql, function (err, result) {
		sql2 = 'select classId from practice where practiceId = ' + req.query.practice_id;
		connection.query(sql2, function (err, result) {
			sql3 = 'update manager set practiceID = 0' + ' where class_id = ' + result[0].classId;
			connection.query(sql3, function (err, result) {
				res.send(JSON.stringify(result));
			});
		});
	});
});

//根据class表中attend的值为0或1设置开始签到和结束签到按钮状态
app.get('/classstate', function (req, res) {
	var sql = 'select attend from manager where class_id = '+ req.query.class_id;
	connection.query(sql, function (err, result) {
		res.send(JSON.stringify(result));
	});
});


//教师点击开始签到按钮
app.get('/startsign', function (req, res) {
	var sql = 'update manager set attend = 1 where class_id = '+ req.query.class_id;
	connection.query(sql, function (err, result) {
		res.send(req.query.class_id);
	});
});

//教师点击结束签到按钮
app.get('/endsign', function (req, res) {
	var sql = 'update manager set attend = 0 where class_id = '+ req.query.class_id;
	connection.query(sql, function (err, result) {
		res.send(req.query.class_id);
	});
});

//显示学生出席情况列表
app.get('/showstulist', function (req, res) {
	var sql1 = 'select student.student_id, student.name from attend inner join student where attend.studentID = student.student_id and attend.class_id ='+ req.query.class_id,
	res_body = {};
	connection.query(sql1, function (err, result) {
		res_body.comedstudent = result;
		var sql2 = 'select student.student_id, student.name from studentclass inner join student where student.student_id = studentclass.student_id and studentclass.class_id  = '+req.query.class_id+' and studentclass.student_id not in (select studentID from attend where class_id = '+req.query.class_id+')';
		connection.query(sql2, function (err, result) {
			res_body.notcomestudent = result;
			res.send(res_body);
		});//查询未签到学生信息
	});//查询已签到学生信息
});









//--------------------------------------------------------------------------------------------------------------------------------
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


//教师端和学生端？显示课程班列表
app.get('/showClassList', function (req, res) {
	var sql = 'SELECT * from class WHERE course_id='+req.query.course_id;
	connection.query(sql, function (err, result) {
		if(req.query.student_id) {
			var res_body ={};
			if(result)
			{
				var qq = 'SELECT class_id, count(class_id) as sumstu from studentclass where course_id = '+req.query.course_id+' group by class_id';
				connection.query(qq, function (err, rows) {
					if(rows)
					{
						for(var w=0; w < rows.length;w++)
						{
							for(var k = 0; k < result.length;k++)
							{
								if(result[k].class_id == rows[w].class_id)
								{
									result[k].student_num= rows[w].sumstu;
								}
							}
						}
					}
					res_body.classmess = result;
					var qq2 = 'select class_id from studentclass where student_id = ' + req.query.student_id+ ' and course_id = '+ req.query.course_id;
					connection.query(qq2, function (err, rows) {
						res_body.allmyclass = rows;
						res.send(JSON.stringify(res_body));
					});
				});
			}
		}
		else {
			if(result)
			{
				var qq = 'SELECT class_id, count(class_id) as sumstu from studentclass where course_id = '+req.query.course_id+' group by class_id';
				connection.query(qq, function (err, rows) {
					if(rows)
					{
						for(var w=0; w < rows.length;w++)
						{
							for(var k = 0; k < result.length;k++)
							{
								if(result[k].class_id == rows[w].class_id)
								{
									result[k].student_num= rows[w].sumstu;
								}
							}
						}
					}
					res.send(JSON.stringify(result));
				});
			}
			
		}

	});
});





//---------------------------------------------------------------------------------------------------------------------------------
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
//学生端课程列表
app.get('/showCourseListStudent', function (req, res) {
	var sql = 'SELECT * from course';
	connection.query(sql, function (err, result) {
		res.send(JSON.stringify(result));
	//console.log(result)
});
});
//学生选课
app.post('/joinClass', function (req, res) {
	var sql = 'SELECT password, student_num from class WHERE class_id='+req.body.class_id;
	console.log(req.body.class_id);
	connection.query(sql, function (err, result) {
		console.log(result);
		var res_body;
		console.log(req.body.pwd); 
		if(req.body.pwd == result[0].password) {
			res_body = {
				join_success: 1
			};
			var addSql = 'INSERT INTO studentClass (course_id,class_id,student_id) VALUES(?,?,?)',
			addSqlParams = [req.body.course_id,req.body.class_id,req.body.student_id];
			connection.query(addSql, addSqlParams, function (err, result) {
		        //console.log(result,err);
		    });
			var changeNumSql = 'UPDATE class SET student_num = ? WHERE class_id='+req.body.class_id,
			sqlParams = [parseInt(result[0].student_num)+1]
			connection.query(changeNumSql, sqlParams, function (err, result) {
				//console.log(result);
				res.send(JSON.stringify(res_body));
			});
		}else {
			res_body = {
				join_success: 0
			};
			res.send(JSON.stringify(res_body));
		}
	})
});

app.get('/manageAttend', function (req, res) {
	var sql = 'select attend from manager WHERE class_id='+req.query.class_id,
	//var sql = "select * from manager ",
	res_body = {};
		//console.log(req);
		connection.query(sql, function (err, result) {
			
			console.log(result)
			res_body = result;
			res.send(JSON.stringify(res_body));
		});

	});

app.post('/studentAttend', function (req, res) {
	//console.log('haha');
	var addUserSql = 'INSERT INTO attend VALUES(?,?,?,?,?)',
	addSqlParams = [req.body.studentID,req.body.latitude,req.body.longitude,req.body.classID,req.body.number1],
	res_body;
        //console.log(addUserSql);

        connection.query(addUserSql, addSqlParams, function (err, result) {
        	if(!err) {
        		res_body = {
        			user_exist:0
        		}
        	}else {
        		res_body = {
        			user_exist:1
        		}
        	}
        	console.log(res_body['user_exist'])
        	res.send(JSON.stringify(res_body));
        });
    });
app.get('/managePractice', function (req, res) {
	var sql = 'select practiceID from manager WHERE class_id='+req.query.class_id,
	res_body = {};
	connection.query(sql, function (err, result) {
		console.log('result=',result)
		res_body = result;
		res.send(JSON.stringify(res_body));
	});

});
app.get('/questionListStudent', function (req, res) {
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
app.get('/practiceItem', function (req, res) {
	var sql = 'SELECT subject,optionDetail,imgUrl,question_id from question WHERE question_id in (SELECT question_id from grades WHERE practice_id= ? AND student_id= ?)',
	params = [req.query.practice_id,req.query.student_id],
	res_body = {};
	connection.query(sql,params, function (err, result) {
		res_body.question = result;
		var sql = 'SELECT * FROM grades WHERE student_id=? AND practice_id=?',
		params = [req.query.student_id, req.query.practice_id];
		connection.query(sql,params, function (err, result) {
			//console.log(result[0]);
			res_body.grades = result;
			res.send(JSON.stringify(res_body));
		});
	});
});

app.post('/postAnswer', function (req, res) {
	var sql = 'INSERT INTO studentpractice (student_id,practice_id,goodNum,totalNum) VALUES(?,?,?,?)',	
	params = [req.body.student_id,req.body.practice_id,req.body.goodNum,req.body.totalNum];
	connection.query(sql, params, function (err, result) {
		//console.log(result)
	});
	var sql1='select * from grades where practice_id= ? AND student_id= ?',
	params1=[req.body.practice_id,req.body.student_id];
	connection.query(sql1, params1, function (err, result) {
		console.log(result);
		if (!result.length){
			console.log('yes');
			for(var i=0;i<req.body.list.length;i++) {
				var question_id = req.body.list[i].question_id,
				answer = req.body.list[i].answer,
				postAnswer = req.body.list[i].postAnswer,
				sql = 'INSERT INTO grades VALUES(?,?,?,?,?)',	
				params = [question_id,req.body.student_id,req.body.practice_id,answer,postAnswer];
				connection.query(sql, params, function (err, result) {
					res.send();

				});
			}
		}
		else{
			//console.log(result)
		}
	});
	for(var i=0;i<req.body.list.length;i++) {
		var question_id = req.body.list[i].question_id,
		answer = req.body.list[i].answer,
		postAnswer = req.body.list[i].postAnswer,
		sql = 'UPDATE grades SET answer = ?,postAnswer = ? WHERE student_id= ? AND question_id= ?',	
		params = [answer,postAnswer,req.body.student_id,question_id];
		connection.query(sql, params, function (err, result) {
			res.send();

		});
	}
}
);




app.get('/getAllGrades', function (req, res) {
	var sql = 'SELECT goodNum,totalNum,practice_id FROM studentpractice WHERE student_id='+req.query.studentId,
	res_body = {};
	connection.query(sql, function (err, result) {
		res_body = result;
		console.log(result);
		res.send(JSON.stringify(res_body));
	});
});



app.listen(3000,function(){
	console.log('server start ....');

});