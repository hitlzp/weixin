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
  database : 'book_manager'
});
app.use(express.static(__dirname + '/public'));
app.post('/login', function (req, res) {
	console.log(1111111);
	var sql, res_body;
	//user as teacher
	if(req.body.entryOption == 1) {
		sql = 'SELECT password from teacher WHERE email = \'dechen@hit.edu.cn\'';
		//sql = 'SELECT password from teacher WHERE email ='+req.body.user;
	}else {
		sql = 'SELECT password from student WHERE student_id ='+req.body.user;
	}

	console.log(sql);
	connection.query(sql,function (err, result) {

        if(err || !result || result.length==0){
        	res_body = {
        		user_exist: 0
          	}
        }else {
        	res_body = {
        		user_exist: 1
          	}
        }
        console.log(res_body);
        res.send(JSON.stringify(res_body));
	});
});

app.listen(3000,function(){
	console.log('server start ....');

});