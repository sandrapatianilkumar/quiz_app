var router = require('express').Router();
var path = require('path');
var db = require('../helpers/db.js');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

router.get('/users', function(req, res) {
    console.log('entered into users get api in routers.js');

    var userid = req.query.userid || 3;

    var query = 'select u.userid, u.username, ur.userrole, uq.questionid, uq.question from userroles as ur  join users as u on u.userroleid = ur.userroleid  join userquestions as uq on ur.userroleid = uq.userroleid where u.userid =' + userid;

    // db.init();

    db.acquire(function(err, connection) {
        if(err) {
            console.log("error in connection -  routes.js", err);
        }
        connection.query(query, function(error, results, fields) {
            connection.release();
            
            if(error) {
                res.status(500).json({
                    success: false,
                    error: error,
                    message: 'Failed to fetch data'
                });
            } else {
                if(results.length>0){
                    var data=[];
                    for(var i=0,length=results.length; i<length;i++) {
                        if(results[i].username && results[i].question) {
                                results[i].question=(results[i].question).replace('<user name>',results[i].username);
                            data.push(results[i]);
                        }                        
                    }

                    res.json({
                        success: true,
                        data: data,
                        message: 'sucessfully fetch data'
                    });
                }
            }
        });
    });
});

router.post('/users', function(req, res) {
    console.log('entered into users post api in routers.js');
    console.log("req.body",req.body);
    var userid = req.body.userid;
    var questionid= req.body.questionid;
    var answer= req.body.answer;
 console.log('userid.............',+userid);
    var insertQuery = 'insert into useranswers (userid, questionid, answer) values (' + userid +', '+ questionid +', "'+ answer +'")';
    if (answer.indexOf("'") > -1){
         var answer = answer.replace(/'/g, "''");
   } 
   else if(answer.indexOf("/'") > -1){
       var answer = answer.replace("/'", "//'");
   } 
   else {
       var answer = answer;
   }
    console.log('insertQuery',insertQuery);

    // db.init();

    db.acquire(function(err, connection) {
        if(err) {
            console.log("error in connection -  routes.js", err);
        }
        connection.query(insertQuery, function(error, results, fields) {
            connection.release();

            if(error){
                res.status(500).json({
                    success: false,
                    error: error,
                    message: 'Failed to insert record'
                });
            } else {
                res.json({
                    success: true,
                    message: 'sucessfully insert record'
                });
            }
        });
    });
});

module.exports = router;