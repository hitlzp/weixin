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

app.listen(3000,function(){
	console.log('server start ....');

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
	console.log(req.body.num);
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