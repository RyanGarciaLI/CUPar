/**
 *  /router/check_teammate.js
 *  Copyright (c) 2018-2019  CUPar Ltd.
 *  @author: Xiao Tianyi (Jack) <jack123qd@hotmail.com>
 *  @version: 1.0
 *  @since 2019-03-19
 *  @last updated: 2019-04-22
 */
`
 A router handles the request of checking the result of matching teammates.
 You need to click the button in account page to check the matching result
 of your teammates. And then you will see the name and SID and other relative
 information of your teammates.
 The specific urls and revelant request the router can handle is following:
           URL          |       Request
    --------------------|-------------------
       /check_teammate  |        POST
    ----------------------------------------
In fact, the matching for teammates are started when user click the 'check teammate'
button. By the way, we use a table 'room_result' to store the result, and use function 
CheckID and ReCheckID to check the result. And team refer to a group of teammates in
the same course, which will be returned to user after there are enough users in the team.
And the design structure of this teammate matching system to check the result occasionally,
since only when user check the result, the matching would start. Maybe move some function into
'process_roommate.js' would be more efficient for this system.
`

var express = require('express');
let router = express.Router();
var mysql  = require('mysql');  
var config = require('../config').config;

// A module to link the mysql database
function link(){
    return(mysql.createPool({     
        host     : 'localhost',       
        user     : config.db_user,              
        password : config.db_pwd,       
        port: '3306',                   
        database: config.db_name,
        useConnectionPooling: true,
        connectionLimit: 500
    }));
}
module.exports=link;


// the main function
router.post('/', function (req, res) {
    var pool = new link();
    
    // the function to search the information with given SID
    function SearchID(){
        this.select=function(callback,id){
        var sql = 'SELECT distinct * FROM Teammate where user_sid = ' + id;
        var option = {};
        pool.query(sql,function(err,result){
            if(err){console.log(err);}
            // default value for result
            option[0] = {'sid':"00000"};
            if(result){
            for(var i = 0; i < result.length; i++)
                {option[i]={'CourseTitle':result[i].CourseTitle,'CourseCode':result[i].CourseCode,
                'Size':result[i].Size,'sid':result[i].user_sid,'college':result[i].college,'sex':result[i].sex,'remark':result[i].remark,'name':result[i].name};}
            }
            // If return directly, it will return undefined. So we need call back function to receive the data.
            callback(option); 
        });
        };
    }
    module.exports = SearchID;
    
    // search if user is already in a team with given sid and other information of the course
    function CheckID(){
        this.select=function(callback,id,adata){
        var sql = 'SELECT * FROM team_result where (user1 = ? or user2 = ? or user3 = ? or user4 = ? or user5 = ? or user6 = ?) AND CourseTitle = ? AND CourseCode = ? AND result != 0';
        var param = [id,id,id,id,id,id,adata.CourseTitle,adata.CourseCode];
        var option = {};  
        pool.query(sql,param,function(err,result){
            if(err){console.log(err);}
            option[0]={'user1':"00000",'user2':null,'result':null};
            if(result){
            for(var i = 0; i < result.length; i++)
                {option[i]={'user1':result[i].user1,'user2':result[i].user2,'user3':result[i].user3,'user4':result[i].user4,'user5':result[i].user5,
                'user6':result[i].user6,'result':result[i].result,'now_size':result[i].now_size,'Size':result[i].Size,'team_id':result[i].team_id};}
            }
            // If return directly, it will return undefined. So we need call back function to receive the data.
            callback(option); 
        });
        };
    }
    module.exports = CheckID;

    // check if the user is the matching hasn't been done with given sid
    function ReCheckID(){
        this.select=function(callback,adata){
        var sql = 'SELECT * FROM team_result where  CourseTitle = ? AND CourseCode = ? AND result != 0 AND now_size != ?';
        var param = [adata.CourseTitle,adata.CourseCode,adata.Size];
        var option = {};  
        pool.query(sql,param,function(err,result){
            if(err){console.log(err);}
            option[0]={'user1':"00000",'user2':null,'result':null};
            if(result){
            for(var i = 0; i < result.length; i++)
                {option[i]={'team_id':result[i].team_id,'user1':result[i].user1,'user2':result[i].user2,'user3':result[i].user3,'user4':result[i].user4,'user5':result[i].user5,
                'user6':result[i].user6,'result':result[i].result,'now_size':result[i].now_size};}
            }
            // If return directly, it will return undefined. So we need call back function to receive the data.
            callback(option); 
        });
        };
    }
    module.exports = ReCheckID;

    // start a new team in the table 'team_result'
    function FirstSaveID(){
        this.select=function(userid,adata){
        var sql = 'INSERT INTO team_result (team_id, user1, CourseTitle, CourseCode, Size,now_size,result) VALUES (0,?,?,?,?,1,2)';
        var param = [userid, adata.CourseTitle, adata.CourseCode, adata.Size];
        pool.query(sql,param,function(err){
            if(err){console.log(err);}
        });
        };
    }
    module.exports = FirstSaveID;

    // update the information about a team in 'team_result'
    function UpdateID(){
        this.select=function(num,user_id,team_id){  
        var sql = 'UPDATE team_result SET user? = ? ,now_size = ? where team_id = ?';
        var param = [num+1,user_id,num+1,team_id];
        pool.query(sql,param,function(err){
            if(err){console.log(err);}
        });
        };
    }
    module.exports = UpdateID;
    
    // check if a user is a freerider given the SID
    function FreeID(){
        this.select=function(callback,id){
        var sql = 'SELECT * FROM freerider where sid = ?';
        var param = [id];
        var option = {};  
        pool.query(sql,param,function(err,result){
            if(err){console.log(err);}
            option[0]={'sid':"00000"};
            if(result){
            for(var i = 0; i < result.length; i++)
                {option[i]={'sid':result[i].sid};}
            }
            // If return directly, it will return undefined. So we need call back function to receive the data.
            callback(option); 
        });
        };
    }
    module.exports = FreeID;

    // initial variables and get the function needed
    var SeID = new SearchID();
    var ChID = new CheckID();
    var RchID = new ReCheckID();
    var FsID = new FirstSaveID();
    var UpID = new UpdateID();
    var FrID = new FreeID();
    var datas = Array;
    var datasC = Array;
    var datasR = Array;
    let userID = req.cookies.islogin.sid; 

    // the function to render the hbs document
    function YesRender(number,team,team_id,status){
        console.log(team);
        console.log(number);
        console.log(team_id);
        switch(number){
        case(1):
        res.render('YesTeammate.hbs', {
            layout: null,
            r_chat_id: team_id + 50,
            r_team_id: team_id,
            r_status: status,
            r_name1: team[0][0].name,
            r_sex1: team[0][0].sex,
            r_sid1: team[0][0].sid,
            r_remark1: team[0][0].remark,
            username: req.cookies.islogin.name,
            login: 1
        });
        break;
        case(2):
            res.render('YesTeammate.hbs', {
            layout: null,
            r_chat_id: team_id + 50,
            r_team_id: team_id,
            r_status: status,
            r_name1: team[0][0].name,
            r_sex1: team[0][0].sex,
            r_sid1: team[0][0].sid,
            r_remark1: team[0][0].remark,
            r_name2: team[1][0].name,
            r_sex2: team[1][0].sex,
            r_sid2: team[1][0].sid,
            r_remark2: team[1][0].remark,
            username: req.cookies.islogin.name,
            login: 1
            });
        break;
        case(3):
            res.render('YesTeammate.hbs', {
            layout: null,
            r_chat_id: team_id + 50,
            r_team_id: team_id,
            r_status: status,
            r_name1: team[0][0].name,
            r_sex1: team[0][0].sex,
            r_sid1: team[0][0].sid,
            r_remark1: team[0][0].remark,
            r_name2: team[1][0].name,
            r_sex2: team[1][0].sex,
            r_sid2: team[1][0].sid,
            r_remark2: team[1][0].remark,
            r_name3: team[2][0].name,
            r_sex3: team[2][0].sex,
            r_sid3: team[2][0].sid,
            r_remark3: team[2][0].remark,
            username: req.cookies.islogin.name,
            login: 1
            });
        break;
        case(4):
            res.render('YesTeammate.hbs', {
            layout: null,
            r_chat_id: team_id + 50,
            r_team_id: team_id,
            r_status: status,
            r_name1: team[0][0].name,
            r_sex1: team[0][0].sex,
            r_sid1: team[0][0].sid,
            r_remark1: team[0][0].remark,
            r_name2: team[1][0].name,
            r_sex2: team[1][0].sex,
            r_sid2: team[1][0].sid,
            r_remark2: team[1][0].remark,
            r_name3: team[2][0].name,
            r_sex3: team[2][0].sex,
            r_sid3: team[2][0].sid,
            r_remark3: team[2][0].remark,
            r_name4: team[3][0].name,
            r_sex4: team[3][0].sex,
            r_sid4: team[3][0].sid,
            r_remark4: team[3][0].remark,
            username: req.cookies.islogin.name,
            login: 1
            });
        break;
        case(5):
            res.render('YesTeammate.hbs', {
            layout: null,
            r_chat_id: team_id + 50,
            r_team_id: team_id,
            r_status: status,
            r_name1: team[0][0].name,
            r_sex1: team[0][0].sex,
            r_sid1: team[0][0].sid,
            r_remark1: team[0][0].remark,
            r_name2: team[1][0].name,
            r_sex2: team[1][0].sex,
            r_sid2: team[1][0].sid,
            r_remark2: team[1][0].remark,
            r_name3: team[2][0].name,
            r_sex3: team[2][0].sex,
            r_sid3: team[2][0].sid,
            r_remark3: team[2][0].remark,
            r_name4: team[3][0].name,
            r_sex4: team[3][0].sex,
            r_sid4: team[3][0].sid,
            r_remark4: team[3][0].remark,
            r_name5: team[4][0].name,
            r_sex5: team[4][0].sex,
            r_sid5: team[4][0].sid,
            r_remark5: team[4][0].remark,
            username: req.cookies.islogin.name,
            login: 1
            });
        break;
        }
    } 
    
    var team = Array;
    
    SeID.select(function (rdata){
        datas = rdata;

        // the user hasn't filled the information
        if(datas[0].sid=='00000'){
        res.render('NoTeammate.hbs',{
            username: req.cookies.islogin.name,
            login: 1
        });
        }

        // the user has filled the information
        else{
        ChID.select(function(rdataM){
            datasC = rdataM;

            // there is no this user's record in team_result
            if(datasC[0].user1=='00000'){
            
            // check is the user is a freerider
            FrID.select(function (freedata){

                // the user is a freerider
                if(freedata[0].sid!='00000'){
                res.render('NoTeammate.hbs',{
                    username: req.cookies.islogin.name,
                    login: 1
                });
                }

                // the user isn't a freerider
                else{
                RchID.select(function(rdataR){
                    datasR = rdataR;

                    // no relative team
                    if(datasR[0].user1=='00000'){
                    FsID.select(userID,datas[0]); // create a team
                    res.render('NoTeammate.hbs',{
                        username: req.cookies.islogin.name,
                        login: 1
                    });
                    }
                    
                    // there is relative team
                    else{
                    UpID.select(datasR[0].now_size,userID,datasR[0].team_id);

                    // if already an incomplete team there, then let user join the first team, which is datasR[0]
                    if(datasR[0].now_size+1!=datas[0].Size){
                        res.render('NoTeammate.hbs',{
                        username: req.cookies.islogin.name,
                        login: 1
                        });
                    }
                    
                    //The team become complete and this user is the last one to join the team
                    else{
                        var now = datasR[0].now_size;
                        var chat_id = datasR[0].team_id;
                        var status = "waiting for reply";

                        // render the hbs document according to the size of team
                        if(now==1){
                        SeID.select(function(rdata_t1){
                            team[0]=rdata_t1;
                            YesRender(now,team,chat_id,status);
                        },datasR[0].user1);
                        }
                        if(now==2){
                        SeID.select(function(rdata_t1){
                            team[0]=rdata_t1;
                            SeID.select(function(rdata_t2){
                            team[1]=rdata_t2;
                            YesRender(now,team,chat_id,status);
                            },datasR[0].user2);
                        },datasR[0].user1);
                        }
                        if(now==3){
                        SeID.select(function(rdata_t1){
                            team[0]=rdata_t1;
                            SeID.select(function(rdata_t2){
                            team[1]=rdata_t2;
                            SeID.select(function(rdata_t3){
                                team[2]=rdata_t3;
                                YesRender(now,team,chat_id,status);
                            },datasR[0].user3);
                            },datasR[0].user2);
                        },datasR[0].user1);
                        }
                        if(now==4){
                        SeID.select(function(rdata_t1){
                            team[0]=rdata_t1;
                            SeID.select(function(rdata_t2){
                            team[1]=rdata_t2;
                            SeID.select(function(rdata_t3){
                                team[2]=rdata_t3;
                                SeID.select(function(rdata_t4){
                                team[3]=rdata_t4;
                                YesRender(now,team,chat_id,status);
                                },datasR[0].user4);
                            },datasR[0].user3);
                            },datasR[0].user2);
                        },datasR[0].user1);
                        }
                        if(now==5){
                        SeID.select(function(rdata_t1){
                            team[0]=rdata_t1;
                            SeID.select(function(rdata_t2){
                            team[1]=rdata_t2;
                            SeID.select(function(rdata_t3){
                                team[2]=rdata_t3;
                                SeID.select(function(rdata_t4){
                                team[3]=rdata_t4;
                                SeID.select(function(rdata_t5){
                                    team[4]=rdata_t5;
                                    YesRender(now,team,chat_id,status);
                                },datasR[0].user5);
                                },datasR[0].user4);
                            },datasR[0].user3);
                            },datasR[0].user2);
                        },datasR[0].user1);
                        }
                    }
                    }
                },datas[0]);
                }
            },userID);
            }

            // user already in a team
            else{

            // this team is complete
            if(datasC[0].now_size==datasC[0].Size){
                
                // prepare the variables
                var now = datasC[0].Size - 1;
                var a = [0,1,2,3,4,5,6];
                var sids = Array;
                var chat_id = datasC[0].team_id;
                sids[0] = datasC[0].user1;
                sids[1] = datasC[0].user2;
                sids[2] = datasC[0].user3;
                sids[3] = datasC[0].user4;
                sids[4] = datasC[0].user5;
                sids[5] = datasC[0].user6;
                
                for(var j=0;j<now+1;j++){
                if(sids[j]==userID){ a.splice(j,1); break; }
                }
                
                var status = "waiting for reply";
                if(datasC[0].result==1)
                status = "Success!"; // all teammates have accepted the result

                // render the hbs document according to the size of team
                if(now==1){
                SeID.select(function(rdata_t1){
                    team[0]=rdata_t1;
                    YesRender(now,team,chat_id,status);
                },sids[a[0]]);
                }
                if(now==2){
                SeID.select(function(rdata_t1){
                    team[0]=rdata_t1;
                    SeID.select(function(rdata_t2){
                    team[1]=rdata_t2;
                    YesRender(now,team,chat_id,status);
                    },sids[a[1]]);
                },sids[a[0]]);
                }
                if(now==3){
                SeID.select(function(rdata_t1){
                    team[0]=rdata_t1;
                    SeID.select(function(rdata_t2){
                    team[1]=rdata_t2;
                    SeID.select(function(rdata_t3){
                        team[2]=rdata_t3;
                        YesRender(now,team,chat_id,status);
                    },sids[a[2]]);
                    },sids[a[1]]);
                },sids[a[0]]);
                }
                if(now==4){
                SeID.select(function(rdata_t1){
                    team[0]=rdata_t1;
                    SeID.select(function(rdata_t2){
                    team[1]=rdata_t2;
                    SeID.select(function(rdata_t3){
                        team[2]=rdata_t3;
                        SeID.select(function(rdata_t4){
                        team[3]=rdata_t4;
                        YesRender(now,team,chat_id,status);
                        },sids[a[3]]);
                    },sids[a[2]]);
                    },sids[a[1]]);
                },sids[a[0]]);
                }
                if(now==5){
                SeID.select(function(rdata_t1){
                    team[0]=rdata_t1;
                    SeID.select(function(rdata_t2){
                    team[1]=rdata_t2;
                    SeID.select(function(rdata_t3){
                        team[2]=rdata_t3;
                        SeID.select(function(rdata_t4){
                        team[3]=rdata_t4;
                        SeID.select(function(rdata_t5){
                            team[4]=rdata_t5;
                            YesRender(now,team,chat_id,status);
                        },sids[a[4]]);
                        },sids[a[3]]);
                    },sids[a[2]]);
                    },sids[a[1]]);
                },sids[a[0]]);
                }
            }
            // the team isn't complete, btw in this situation the user can just wait for other teammates
            else{
                res.render('NoTeammate.hbs',{
                username: req.cookies.islogin.name,
                login: 1
                });
            }
            }
        },userID,datas[0]);
        }
    },userID);
  
});

module.exports = router;